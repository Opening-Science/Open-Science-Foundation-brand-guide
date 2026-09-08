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
        shutil.copytree(module.KIT, self.kit, ignore=shutil.ignore_patterns('.git', '__pycache__', '.venv', 'node_modules', '.nuxt', '.output', '.data', 'dist'))
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

    def test_build_output_and_local_lab_do_not_change_distribution(self):
        output = self.kit/'starter/.output/public'
        output.mkdir(parents=True)
        (output/'index.html').write_text('<h1>Generated output</h1>')
        (self.kit/'starter/dist').symlink_to('.output/public', target_is_directory=True)
        lab = self.kit/'starter/app/pages/_lab'
        lab.mkdir(parents=True, exist_ok=True)
        (lab/'probe.vue').write_text('<template><h1>Local lab</h1></template>')
        self.assertEqual([], module.check(self.kit))
        self.assertEqual(module.inventory(self.kit), module.inventory())

    def test_bad_files_do_not_hide_theme_tampering(self):
        theme = self.kit/'starter/app/assets/css/main.css'
        theme.write_text(theme.read_text().replace('#73adff', '#73adfe'))
        (self.kit/'stray.html').write_text('unapproved')
        (self.kit/'binary.txt').write_bytes(b'OTTOtest fixture')
        (self.kit/'unreadable.txt').write_bytes(bytes([255]))
        (self.kit/'source-link.css').symlink_to(theme)
        errors = module.check(self.kit)
        for expected in ['Unapproved distribution file: stray.html',
                         'Binary asset prohibited: binary.txt',
                         'unreadable.txt', 'Source symlink prohibited: source-link.css',
                         'Canonical theme differs', 'Copied source differs',
                         'Distribution drift: starter/app/assets/css/main.css',
                         'Web and brand source snapshots disagree']:
            self.assertTrue(any(expected in error for error in errors), (expected, errors))
        with self.assertRaises(ValueError):
            module.inventory(self.kit)  # --record must never accept a partial inventory.

    def test_missing_theme_still_reports_snapshot_checks(self):
        (self.kit/'starter/app/assets/css/main.css').unlink()
        errors = module.check(self.kit)
        self.assertTrue(any('Canonical theme differs' in error for error in errors))
        self.assertTrue(any('Web and brand source snapshots disagree' in error for error in errors))
