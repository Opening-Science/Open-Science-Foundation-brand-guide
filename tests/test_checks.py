# SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
# SPDX-License-Identifier: Apache-2.0
import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest
spec = importlib.util.spec_from_file_location('brand_check', Path(__file__).resolve().parents[1]/'scripts/check.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class BoundaryChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)/'repo'
        shutil.copytree(module.ROOT, self.root, ignore=shutil.ignore_patterns('.git', '__pycache__', '.venv', 'node_modules', '.nuxt', '.output', '.data', 'dist'))
    def tearDown(self):
        self.temp.cleanup()
    def test_new_file_needs_licence(self):
        (self.root/'unclassified.txt').write_text('Unreviewed content')
        self.assertTrue(any('Unclassified file: unclassified.txt' in x for x in module.check(self.root)))
    def test_font_magic_cannot_hide_behind_extension(self):
        (self.root/'tokens/font-data.bin').write_bytes(b'OTTOtest fixture, not a font')
        self.assertTrue(any('Font binary prohibited' in x for x in module.check(self.root)))
    def test_logo_modified_without_provenance_is_rejected(self):
        p=next((self.root/'assets/logo').glob('*.svg'))
        p.write_bytes(p.read_bytes()+b'\n')
        self.assertTrue(any('Logo differs' in x for x in module.check(self.root)))
    def test_css_drift_is_rejected(self):
        p=self.root/'tokens/tokens.css'
        p.write_text(p.read_text().replace('--osf-white: #ffffff;', '--osf-white: #eeeeee;'))
        self.assertTrue(any('CSS token mismatch: white' in x for x in module.check(self.root)))
    def test_escaping_skill_link_is_rejected(self):
        p=self.root/'SKILL.md'
        p.write_text(p.read_text()+'\n[bad](../outside.md)\n')
        self.assertTrue(any('Broken or escaping local link' in x for x in module.check(self.root)))

if __name__ == '__main__':
    unittest.main()
