#!/usr/bin/env python3
"""
CSS Extraction Script for Ima Claw v2
Safely extracts common nav CSS from inline <style> blocks and links external CSS files.

Strategy:
1. Add <link> to nav.css and variables.css in <head>
2. Remove nav-related CSS rules from inline <style> blocks
3. Keep all other inline CSS untouched

Usage: python3 extract-nav-css.py [--dry-run] [--file path/to/file.html]
"""

import re
import sys
import os
import glob

# Nav-related CSS selectors to remove from inline styles
NAV_SELECTORS = [
    r'nav\{[^}]+\}',
    r'nav\.scrolled\{[^}]+\}',
    r'\.logo\{[^}]+\}',
    r'\.logo img\{[^}]+\}',
    r'\.logo-text\{[^}]+\}',
    r'\.logo-text b\{[^}]+\}',
    r'\.nav-links\{[^}]+\}',
    r'\.nav-links a\{[^}]+\}',
    r'\.nav-links a:hover\{[^}]+\}',
    r'\.nav-adopt\{[^}]+\}',
    r'\.nav-cta\{[^}]+\}',
    r'\.nav-cta:hover\{[^}]+\}',
    r'\.hamburger\{[^}]+\}',
    r'\.lang-dropdown\{[^}]+\}',
    r'\.lang-trigger\{[^}]+\}',
    r'\.lang-trigger:hover\{[^}]+\}',
    r'\.lang-menu\{[^}]+\}',
    r'\.lang-dropdown\.open \.lang-menu\{[^}]+\}',
    r'\.lang-menu button\{[^}]+\}',
    r'\.lang-menu button:hover\{[^}]+\}',
    r'\.nav-links\.open\{[^}]+\}',
    r'\.nav-links a:last-child\{[^}]+\}',
    r'\.nav-links \.lang-dropdown\{[^}]+\}',
]

# Comment patterns to remove
NAV_COMMENTS = [
    r'/\* Navigation[^*]*\*/',
    r'/\* Nav bar \*/',
    r'/\* Logo \*/',
    r'/\* Nav links \*/',
    r'/\* Hamburger \*/',
    r'/\* Language dropdown \*/',
    r'/\* Mobile responsive \*/',
]

def get_css_link_path(html_path):
    """Calculate relative path from HTML file to assets/css/"""
    rel_dir = os.path.dirname(html_path)
    if not rel_dir:
        return 'assets/css'
    depth = rel_dir.count('/') + 1
    return '../' * depth + 'assets/css'

def process_file(filepath, dry_run=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Skip if already has nav.css linked
    if 'nav.css' in content:
        print(f"  ⏭️  {filepath} (already linked)")
        return False
    
    # Calculate relative path
    rel = os.path.relpath(filepath, '/tmp/ima-claw-v2')
    css_path = get_css_link_path(rel)
    
    # 1. Add CSS links before <style> tag
    css_links = f'<link rel="stylesheet" href="{css_path}/variables.css">\n<link rel="stylesheet" href="{css_path}/nav.css">\n'
    
    if '<style>' in content:
        content = content.replace('<style>', css_links + '<style>', 1)
    elif '</head>' in content:
        content = content.replace('</head>', css_links + '</head>', 1)
    
    # 2. Remove nav CSS from inline style blocks
    # Extract style block
    style_match = re.search(r'(<style>)(.*?)(</style>)', content, re.DOTALL)
    if style_match:
        style_content = style_match.group(2)
        
        # Remove nav selectors
        for pattern in NAV_SELECTORS:
            style_content = re.sub(pattern + r'\n?', '', style_content)
        
        # Remove nav comments
        for pattern in NAV_COMMENTS:
            style_content = re.sub(pattern + r'\n?', '', style_content)
        
        # Clean up empty lines
        style_content = re.sub(r'\n{3,}', '\n\n', style_content)
        
        content = content[:style_match.start()] + '<style>' + style_content + '</style>' + content[style_match.end():]
    
    if content == original:
        print(f"  ⏭️  {filepath} (no changes)")
        return False
    
    if dry_run:
        print(f"  🔍 {filepath} (would change)")
        return True
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✅ {filepath}")
    return True

def main():
    dry_run = '--dry-run' in sys.argv
    single_file = None
    
    for i, arg in enumerate(sys.argv):
        if arg == '--file' and i + 1 < len(sys.argv):
            single_file = sys.argv[i + 1]
    
    if single_file:
        files = [single_file]
    else:
        files = glob.glob('/tmp/ima-claw-v2/**/*.html', recursive=True)
        files = [f for f in files if '.git' not in f and 'article-assets' not in f]
    
    print(f"{'DRY RUN - ' if dry_run else ''}Processing {len(files)} files...")
    changed = 0
    for f in sorted(files):
        if process_file(f, dry_run):
            changed += 1
    
    print(f"\n{'Would change' if dry_run else 'Changed'}: {changed}/{len(files)} files")

if __name__ == '__main__':
    main()
