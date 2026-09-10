# SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
# SPDX-License-Identifier: Apache-2.0
"""Validate licence scope, brand data and the guidelines repository boundary."""
from pathlib import Path
import hashlib
import json
import re
import sys
if sys.version_info < (3, 11):
    raise SystemExit('Use Python 3.11 or later to run these checks.')
import tomllib
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
IGNORED = {'.git', '__pycache__', '.venv', 'node_modules', '.nuxt', '.output', '.data', 'dist'}
FONT_SUFFIXES = {'.otf', '.ttf', '.woff', '.woff2', '.eot', '.odttf', '.ttc'}
OFFICE_SUFFIXES = {'.pptx', '.potx', '.key', '.docx', '.dotx', '.xlsx', '.zip', '.pdf'}
LICENCES = {'CC-BY-4.0', 'Apache-2.0', 'LicenseRef-OSF-Brand-Assets', 'MIT',
            'LicenseRef-OSF-Website-Media'}

def licence_parts(expression):
    return expression.split(' AND ')

def admitted_files(root):
    result = {}
    for path in ('assets/motion/manifest.json', 'docs/guide/manifest.json'):
        for item in json.loads((root/path).read_text())['assets']:
            name = item['path']
            if name in result:
                raise ValueError('Duplicate admitted file: '+name)
            if not (root/name).resolve().is_relative_to(root.resolve()):
                raise ValueError('Escaping admitted file: '+name)
            result[name] = item
    return result

def matches(path, pattern):
    # REUSE-style * excludes slashes; ** spans directories.
    expr = ''.join('.*' if x == '**' else '[^/]*' if x == '*' else re.escape(x)
                   for x in re.split(r'(\*\*|\*)', pattern))
    return re.fullmatch(expr, path) is not None

def classification(path, annotations):
    result = None
    for row in annotations:
        patterns = row['path'] if isinstance(row['path'], list) else [row['path']]
        if any(matches(path, pattern) for pattern in patterns):
            result = row['SPDX-License-Identifier']
    return result

def content_files(root):
    return sorted(p for p in root.rglob('*') if p.is_file()
                  and not any(x in IGNORED for x in p.relative_to(root).parts))

# REUSE-IgnoreStart
def check(root=ROOT):
    errors = []
    config = tomllib.loads((root/'REUSE.toml').read_text())
    if config.get('version') != 1:
        errors.append('Unsupported REUSE version')
    rows = config.get('annotations', [])
    for row in rows:
        if not set(licence_parts(row.get('SPDX-License-Identifier', ''))) <= LICENCES:
            errors.append('Unknown licence in REUSE.toml')
    manifest = json.loads((root/'assets/logo/manifest.json').read_text())
    approved_logos = {x['path']: x['sha256'] for x in manifest}
    try:
        admitted = admitted_files(root)
    except (ValueError, KeyError, OSError) as exc:
        errors.append('Invalid asset admission manifest: '+str(exc))
        admitted = {}
    for p in content_files(root):
        name = p.relative_to(root).as_posix()
        data = p.read_bytes()
        if p.is_symlink():
            errors.append('Symlink not admitted: '+name)
        if p.suffix.lower() in FONT_SUFFIXES or data[:4] in (b'OTTO', b'wOFF', b'wOF2', b'ttcf', b'\x00\x01\x00\x00'):
            errors.append('Font binary prohibited: '+name)
        admitted_binary = name in admitted and p.suffix.lower() in {'.pdf', '.png', '.jpg', '.gif', '.mp4'}
        if (p.suffix.lower() in OFFICE_SUFFIXES and not (admitted_binary and p.suffix.lower() == '.pdf')) or data[:4] == b'PK\x03\x04':
            errors.append('Office/archive/PDF file requires separate admission: '+name)
        if p.suffix.lower() in {'.jpg', '.jpeg', '.webp', '.gif'} and not admitted_binary:
            errors.append('Photograph/image not admitted: '+name)
        if p.suffix.lower() in {'.png', '.svg'} and name not in approved_logos and not admitted_binary:
            errors.append('Unregistered artwork: '+name)
        if p.name == '.env' or p.name.startswith('.env.'):
            errors.append('Environment secrets file prohibited: '+name)
        if name.startswith('LICENSES/'):
            if p.name not in {x+'.txt' for x in LICENCES}:
                errors.append('Unexpected licence text: '+name)
            continue
        if name.endswith('.license'):
            original = root/name[:-8]
            if not original.is_file():
                errors.append('Orphan sidecar: '+name)
            continue
        licence = classification(name, rows)
        if licence is None:
            errors.append('Unclassified file: '+name)
            continue
        for part in licence_parts(licence):
            if not (root/'LICENSES'/f'{part}.txt').is_file():
                errors.append('Missing licence text: '+part)
        if name in admitted:
            item = admitted[name]
            if hashlib.sha256(data).hexdigest() != item['sha256']:
                errors.append('Admitted asset differs from recorded source: '+name)
            if licence != item['license']:
                errors.append('Admitted asset mislicensed: '+name)
            sidecar = p.with_name(p.name+'.license')
            if not sidecar.exists() or ('SPDX-License-Identifier: '+licence) not in sidecar.read_text():
                errors.append('Missing admitted asset licence sidecar: '+name)
            if admitted_binary:
                continue
        if name in approved_logos:
            if hashlib.sha256(data).hexdigest() != approved_logos[name]:
                errors.append('Logo differs from authorised source: '+name)
            if licence != 'LicenseRef-OSF-Brand-Assets':
                errors.append('Artwork mislicensed: '+name)
            sidecar = p.with_name(p.name+'.license')
            if not sidecar.exists() or 'SPDX-License-Identifier: LicenseRef-OSF-Brand-Assets' not in sidecar.read_text():
                errors.append('Missing artwork licence sidecar: '+name)
            continue
        try:
            text = data.decode('utf-8')
        except UnicodeDecodeError:
            errors.append('Unexpected binary: '+name)
            continue
        if re.search(r'/Users/[A-Za-z0-9_.-]+/', text):
            errors.append('Personal filesystem path: '+name)
        if re.search(r'\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})', text):
            errors.append('Possible credential: '+name)
        notices = re.findall(r'SPDX-License-Identifier:\s*([^\s<>]+)', text)
        # Code may contain examples of the scanner itself; explicit file headers govern.
        if p.suffix == '.md':
            if not notices or notices[0] != licence:
                errors.append('Markdown SPDX notice mismatch: '+name)
            if '\u2014' in text or '\u2013' in text:
                errors.append('Long dash in authored copy: '+name)
            for target in re.findall(r'\]\(([^)]+)\)', text):
                if target.startswith(('http:', 'https:', 'mailto:', '#')):
                    continue
                target = unquote(target.split('#')[0])
                resolved = (p.parent/target).resolve()
                if not resolved.is_relative_to(root.resolve()) or not resolved.exists():
                    errors.append('Broken or escaping local link: '+name+' -> '+target)
        if p.name == 'SKILL.md':
            front = re.match(r'^---\n(.*?)\n---\n', text, re.S)
            if not front:
                errors.append('Missing skill frontmatter: '+name)
            elif not re.search(r'^name: [a-z0-9-]{1,64}$', front[1], re.M) or not re.search(r'^description: .+', front[1], re.M):
                errors.append('Invalid skill frontmatter: '+name)
    for name in approved_logos:
        if not (root/name).exists():
            errors.append('Missing registered logo: '+name)
    for name in admitted:
        if not (root/name).is_file():
            errors.append('Missing admitted asset: '+name)
    tokens = json.loads((root/'tokens/tokens.json').read_text())
    css = (root/'tokens/tokens.css').read_text()
    for name, value in tokens['colors'].items():
        if name == 'red':
            continue # OpenTwin-scoped token is intentionally excluded from OSF CSS.
        if f'--osf-{name}: {value};' not in css:
            errors.append('CSS token mismatch: '+name)
    if tokens['fonts']['mono'] != 'ABC Diatype Semi Mono' or "--osf-font-mono: 'ABC Diatype Semi Mono';" not in css:
        errors.append('Desktop mono font-family mismatch')
    brand = json.loads((root/'brand.json').read_text())
    if brand['sourceThemeSha256'] != tokens['sourceSha256']:
        errors.append('Theme provenance mismatch')
    if brand['visibilityIntent'] != 'private' or brand['publicReleaseApproved'] is not False:
        errors.append('Public-release decision requires an explicit policy/check update')
    if brand['defaultOption'] != '01' or brand['optionsStatus'] != 'default_selected':
        errors.append('Changing the owner-selected default requires an explicit policy/check update')
    if sorted(x['id'] for x in tokens['variants']) != brand['options']:
        errors.append('Option list mismatch')
    return errors

# REUSE-IgnoreEnd

if __name__ == '__main__':
    problems = check()
    if problems:
        print('\n'.join(problems))
        raise SystemExit(1)
    print('PASS: licence coverage, logo provenance, asset boundaries, links, skills, tokens and selected default')
