/**
 * Ima Claw v2 - Shared Navigation
 * Auto-injects nav HTML if <nav> is empty. Handles hamburger, lang dropdown.
 */
(function () {

  // ─── Auto-inject nav if empty ───────────────────────────────────────────
  var nav = document.querySelector('nav');
  if (nav && nav.children.length === 0) {
    var base = '/ima-claw-v2';
    var p = window.location.pathname;
    var section = p.includes('/blog') ? 'blog' :
                  p.includes('/skills') ? 'skills' :
                  p.includes('/pricing') ? 'pricing' :
                  p.includes('/adopt') ? 'adopt' :
                  p.includes('/docs') ? 'docs' : 'home';
    var act = function(s){ return section === s ? 'style="font-weight:700;color:var(--text)"' : ''; };
    var discordIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>';
    nav.innerHTML =
      '<a href="' + base + '/" class="logo"><img src="' + base + '/logo-nav.png" alt="Ima Claw logo"><div class="logo-text">Ima<b>Claw</b> <span style="font-size:11px;color:var(--text-3);font-weight:400;margin-left:6px">by ImaStudio</span></div></a>' +
      '<div class="nav-links">' +
        '<a href="' + base + '/" data-i18n="nav.home" ' + act('home') + '>Home</a>' +
        '<a href="' + base + '/adopt/" data-i18n="nav.adopt" style="color:var(--lobster-light);font-weight:600">🦞 Adopt</a>' +
        '<a href="' + base + '/skills/" data-i18n="nav.skills" ' + act('skills') + '>Skills</a>' +
        '<a href="' + base + '/pricing/" data-i18n="nav.pricing" ' + act('pricing') + '>🛒 Pricing</a>' +
        '<a href="' + base + '/docs/" data-i18n="nav.docs" ' + act('docs') + '>Docs</a>' +
        '<a href="' + base + '/blog/" data-i18n="nav.blog" ' + act('blog') + '>Blog</a>' +
        '<a href="https://discord.gg/UdXFVYhh" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px;color:#5865F2;font-weight:600">' + discordIcon + 'Discord</a>' +
        '<div class="lang-dropdown" style="position:relative;margin-left:8px"><button class="lang-trigger">🌐 中文 ▾</button><div class="lang-menu"><button data-lang="zh-CN">🇨🇳 中文</button><button data-lang="en">🇺🇸 English</button></div></div>' +
      '</div>' +
      '<button class="hamburger"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>';
  }

  // Re-apply translations to newly injected nav
  // (core.js may have run before nav was injected)
  setTimeout(function() {
    var lang = (typeof getLang === 'function') ? getLang() :
               (localStorage.getItem('imaclaw-lang') || 'zh-CN');
    if (typeof setLang === 'function') setLang(lang);
  }, 0);

  // ─── Hamburger toggle ────────────────────────────────────────────────────
  var hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelector('.nav-links').classList.toggle('open');
    });
  }

  // ─── Lang dropdown ───────────────────────────────────────────────────────
  var triggers = document.querySelectorAll('.lang-trigger');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (e) {
      e.stopPropagation();
      this.parentElement.classList.toggle('open');
    });
  }
  var langBtns = document.querySelectorAll('.lang-menu button');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (lang && typeof setLang === 'function') setLang(lang);
    });
  }

  // ─── Close on outside click ──────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var navLinks = document.querySelector('.nav-links');
    var ham = document.querySelector('.hamburger');
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== ham && !e.target.closest('.lang-dropdown')) {
      navLinks.classList.remove('open');
    }
    document.querySelectorAll('.lang-dropdown.open').forEach(function(d){
      if(!d.contains(e.target)) d.classList.remove('open');
    });
  });
})();
