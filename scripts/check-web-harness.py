# SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
# SPDX-License-Identifier: Apache-2.0
"""Verify the explicit, asset-free distribution and copied-source provenance."""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT/'web-harness'
MANIFEST = KIT/'manifest.json'
DEV_DIRS = {'node_modules', '.nuxt', '.output', '.data', 'dist'}
TEXT_SUFFIXES = {'.md', '.json', '.css', '.vue', '.ts', '.mjs', '.toml', '.txt', '.yml'}
PLAIN_NAMES = {'LICENSE', '.gitignore'}

def inventory(kit=KIT, errors=None):
    # Validation accumulates findings; recording remains strict and cannot approve
    # a partial inventory after unreadable, binary or unapproved input.
    problems = [] if errors is None else errors
    found = {}
    for path in sorted(kit.rglob('*')):
        rel = path.relative_to(kit)
        if len(rel.parts) > 1 and rel.parts[0] == 'starter' and rel.parts[1] in DEV_DIRS:
            continue
        # Local design exploration is not part of the distribution. Production
        # containment remains enforced by Nuxt and the independent output guard.
        if rel.parts[:4] == ('starter', 'app', 'pages', '_lab'):
            continue
        if path == kit/'manifest.json':
            continue
        try:
            if path.is_symlink():
                raise ValueError('Source symlink prohibited: '+rel.as_posix())
            if not path.is_file():
                continue
            if path.suffix not in TEXT_SUFFIXES and path.name not in PLAIN_NAMES:
                raise ValueError('Unapproved distribution file: '+rel.as_posix())
            data = path.read_bytes()
            if data[:4] in (b'OTTO', b'wOFF', b'wOF2', b'ttcf', b'\x00\x01\x00\x00', b'PK\x03\x04'):
                raise ValueError('Binary asset prohibited: '+rel.as_posix())
            data.decode('utf-8')
            if any(part in {'mirror', 'content', 'node_modules', 'reference-captures'} for part in rel.parts):
                raise ValueError('Excluded source directory: '+rel.as_posix())
            found[rel.as_posix()] = hashlib.sha256(data).hexdigest()
        except (ValueError, OSError) as exc:
            problems.append(f'{rel.as_posix()}: {exc}')
    if errors is None and problems:
        raise ValueError('\n'.join(problems))
    return found

def check(kit=KIT):
    errors = []
    try:
        manifest = json.loads((kit/'manifest.json').read_text())
        actual = inventory(kit, errors)
        if manifest['files'] != actual:
            for name in sorted(set(manifest['files']) | set(actual)):
                if manifest['files'].get(name) != actual.get(name):
                    errors.append('Distribution drift: '+name)
        for item in json.loads((kit/'upstream-files.json').read_text()):
            if actual.get(item['destination']) != item['sha256']:
                errors.append('Copied source differs from recorded export: '+item['destination'])
        theme = actual.get('starter/app/assets/css/main.css')
        if theme != manifest['source']['themeSha256']:
            errors.append('Canonical theme differs from the upstream snapshot')
        brand = json.loads((kit.parent/'brand.json').read_text())
        if manifest['source']['commit'] != brand['sourceCommit'] or theme != brand['sourceThemeSha256']:
            errors.append('Web and brand source snapshots disagree')
    except (ValueError, KeyError, OSError, UnicodeError) as exc:
        errors.append(str(exc))
    return errors

if __name__ == '__main__':
    if sys.argv[1:] == ['--record']:
        brand = json.loads((ROOT/'brand.json').read_text())
        try:
            version = json.loads(MANIFEST.read_text())['version']
        except (OSError, ValueError, KeyError):
            version = '0.1.0'  # the tool that rewrites the manifest must survive a broken one
        manifest = {'version':version, 'source':{'repository':brand['sourceRepository'], 'commit':brand['sourceCommit'], 'themeSha256':brand['sourceThemeSha256']}, 'files': inventory()}
        MANIFEST.write_text(json.dumps(manifest, indent=2)+'\n')
        print('Recorded distribution inventory. Review source and manifest changes together.')
    elif sys.argv[1:]:
        raise SystemExit('Usage: python3 scripts/check-web-harness.py [--record]')
    else:
        errors = check()
        if errors:
            raise SystemExit('\n'.join(errors))
        print('PASS: explicit web distribution, asset boundary, copied-source hashes and canonical theme')
