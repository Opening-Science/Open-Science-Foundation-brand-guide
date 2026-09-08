# SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
# SPDX-License-Identifier: Apache-2.0
import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('harness_check', Path(__file__).resolve().parents[1]/'scripts/check-web-harness.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class HarnessDistribution(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.kit = self.root/'web-harness'
        shutil.copytree(module.KIT, self.kit, ignore=shutil.ignore_patterns('node_modules', '.nuxt', '.output', '.data'))
        shutil.copy2(module.ROOT/'brand.json', self.root/'brand.json')
    def tearDown(self):
        self.tmp.cleanup()
    def test_canonical_theme_cannot_drift(self):
        p = self.kit/'starter/app/assets/css/main.css'
        p.write_text(p.read_text().replace('#73adff', '#73adfe'))
        self.assertTrue(any('Canonical theme differs' in x for x in module.check(self.kit)))
    def test_extra_source_cannot_silently_ship(self):
        (self.kit/'unexpected.json').write_text('{}')
        self.assertIn('Distribution drift: unexpected.json', module.check(self.kit))
    def test_font_disguised_as_text_is_rejected(self):
        (self.kit/'unexpected.txt').write_bytes(b'OTTOtest fixture')
        self.assertTrue(any('Binary asset prohibited' in x for x in module.check(self.kit)))
    def test_missing_component_is_rejected(self):
        (self.kit/'starter/app/components/section/SectionIntro.vue').unlink()
        self.assertTrue(any('SectionIntro.vue' in x for x in module.check(self.kit)))
