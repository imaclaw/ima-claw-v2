/**
 * Ima Claw v2 - Shared Navigation
 * Handles hamburger menu, lang dropdown, mobile nav
 */
(function () {
  // Hamburger toggle
  var hamburger = document.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelector('.nav-links').classList.toggle('open');
    });
  }

  // Lang dropdown toggle
  var triggers = document.querySelectorAll('.lang-trigger');
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (e) {
      e.stopPropagation();
      this.parentElement.classList.toggle('open');
    });
  }

  // Lang menu buttons
  var langBtns = document.querySelectorAll('.lang-menu button');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (lang && typeof setLang === 'function') setLang(lang);
    });
  }

  // Close mobile nav on outside click
  document.addEventListener('click', function (e) {
    var nav = document.querySelector('.nav-links');
    var ham = document.querySelector('.hamburger');
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target !== ham && !e.target.closest('.lang-dropdown')) {
      nav.classList.remove('open');
    }
  });
})();
