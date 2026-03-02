/**
 * Ima Claw i18n Core Engine v2
 * 
 * 全站唯一的语言切换引擎
 * - HTML 里只写 data-i18n="key"，不写文字
 * - 翻译全部在 /i18n/*.json 里
 * - localStorage 优先 > URL参数 > 浏览器语言 > 默认 zh-CN
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'imaclaw-lang';
  var DEFAULT_LANG = 'zh-CN';
  var SUPPORTED = ['zh-CN', 'en', 'es', 'ja', 'ar'];
  var LANG_LABELS = {
    'zh-CN': '🇨🇳 中文',
    'en': '🇺🇸 EN',
    'es': '🇪🇸 ES',
    'ja': '🇯🇵 JA',
    'ar': '🇸🇦 AR'
  };

  // Cache loaded translations
  var cache = {};
  var currentLang = null;

  // Detect base path (handles subfolders like /blog/, /docs/)
  var scripts = document.getElementsByTagName('script');
  var basePath = '';
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    var idx = src.indexOf('i18n/core.js');
    if (idx !== -1) {
      basePath = src.substring(0, idx);
      break;
    }
  }

  /**
   * Detect initial language
   * Priority: localStorage > URL ?lang= > browser language > default
   */
  function detectLang() {
    // 1. localStorage (user's manual choice)
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
      // Handle legacy 'zh' value
      if (stored === 'zh') return 'zh-CN';
    } catch (e) {}

    // 2. URL parameter
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && SUPPORTED.indexOf(urlLang) !== -1) return urlLang;

    // 3. Browser language
    var nav = navigator.language || navigator.userLanguage || '';
    if (nav.startsWith('zh')) return 'zh-CN';
    var short = nav.split('-')[0];
    if (SUPPORTED.indexOf(short) !== -1) return short;
    // Check full match
    if (SUPPORTED.indexOf(nav) !== -1) return nav;

    return DEFAULT_LANG;
  }

  /**
   * Load a language JSON file
   */
  function loadLang(lang, callback) {
    if (cache[lang]) {
      callback(cache[lang]);
      return;
    }

    var xhr = new XMLHttpRequest();
    var url = basePath + 'i18n/' + lang + '.json?v=9';
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            cache[lang] = JSON.parse(xhr.responseText);
          } catch (e) {
            cache[lang] = {};
          }
        } else {
          cache[lang] = {};
        }
        callback(cache[lang]);
      }
    };
    xhr.send();
  }

  /**
   * Apply translations to the page
   */
  function applyTranslations(dict) {
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    }
  }

  /**
   * Update UI elements (trigger button, html lang, RTL)
   */
  function updateUI(lang) {
    // Update <html lang>
    document.documentElement.lang = lang;

    // RTL support
    document.documentElement.style.direction = (lang === 'ar') ? 'rtl' : 'ltr';

    // Update lang trigger button text
    var triggers = document.querySelectorAll('.lang-trigger');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].textContent = '🌐 ' + (LANG_LABELS[lang] || lang) + ' ▾';
    }

    // Close dropdowns
    var dropdowns = document.querySelectorAll('.lang-dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('open');
    }

    // Swap mascot for Arabic
    var mascots = document.querySelectorAll('.hero-mascot img');
    for (var i = 0; i < mascots.length; i++) {
      mascots[i].src = (lang === 'ar') ? (basePath + 'mascot-ar.png?v=2') : (basePath + 'mascot.png');
    }
  }

  /**
   * Main: Set language
   */
  function setLang(lang) {
    if (!lang || SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    // Handle legacy
    if (lang === 'zh') lang = 'zh-CN';

    currentLang = lang;

    // Save to localStorage
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    // Load and apply
    loadLang(lang, function (dict) {
      applyTranslations(dict);
      updateUI(lang);
      try{window.dispatchEvent(new Event('langChanged'))}catch(e){}
    });
  }

  /**
   * Get current language
   */
  function getLang() {
    return currentLang || detectLang();
  }

  // Expose globally
  window.setLang = setLang;
  window.getLang = getLang;
  window.I18N_SUPPORTED = SUPPORTED;
  window.I18N_LABELS = LANG_LABELS;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setLang(detectLang());
    });
  } else {
    setLang(detectLang());
  }

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.lang-dropdown')) {
      var dropdowns = document.querySelectorAll('.lang-dropdown');
      for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove('open');
      }
    }
  });

})();
