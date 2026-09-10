# SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
# SPDX-License-Identifier: Apache-2.0
"""Verify the complete motion inventory and portable preview dependencies."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]

def check(root=ROOT):
    errors = []
    data = json.loads((root/'assets/motion/manifest.json').read_text())
    rows = data['assets']
    by_kind = {kind: [x for x in rows if x['kind'] == kind]
               for kind in ('core', 'context', 'video', 'poster', 'capture')}
    for kind, expected in [('core', 10), ('context', 38), ('video', 5), ('poster', 4), ('capture', 18)]:
        if len(by_kind[kind]) != expected:
            errors.append(f'Motion inventory incomplete: {kind}, expected {expected}')
    if not re.fullmatch('[a-f0-9]{40}', data['sourceCommit']):
        errors.append('Motion source commit must be immutable')
    for item in rows:
        path = root/item['path']
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
            errors.append('Motion hash mismatch: '+item['path'])
    names = {Path(x['path']).name for x in by_kind['capture']}
    for key in ('hero', 'openness', 'transparency', 'collaboration', 'reproducibility', 'logo'):
        for suffix in ('.gif', '.mp4', '-still.png'):
            if key+suffix not in names:
                errors.append('Missing motion export: '+key+suffix)
    package = json.loads((root/'assets/motion/package.json').read_text())
    lock = json.loads((root/'assets/motion/package-lock.json').read_text())
    for group in ('dependencies', 'devDependencies'):
        for name, version in package[group].items():
            if lock['packages']['node_modules/'+name]['version'] != version:
                errors.append('Motion dependency lock drift: '+name)
    return errors

if __name__ == '__main__':
    problems = check()
    if problems:
        raise SystemExit('\n'.join(problems))
    print('PASS: 6 animations, 48 original source files, 9 original media files, 18 captures and dependency pins')
