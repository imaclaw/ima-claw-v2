// Countdown timer — 72h from launch (2026-03-01 04:30 CST)
(function(){
  var end=new Date('2026-03-04T04:30:00+08:00').getTime();
  function tick(){
    var now=Date.now(),d=end-now;
    var els=document.querySelectorAll('.countdown-timer');
    if(d<=0){els.forEach(function(e){e.textContent='即刻'});return}
    var h=Math.floor(d/36e5),m=Math.floor((d%36e5)/6e4),s=Math.floor((d%6e4)/1e3);
    var t=(h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    els.forEach(function(e){e.textContent=t});
    requestAnimationFrame(tick);
  }
  tick();
})();
// Close mobile nav on outside click
document.addEventListener("click",function(e){var nav=document.querySelector(".nav-links");var ham=document.querySelector(".hamburger");if(nav&&nav.classList.contains("open")&&!nav.contains(e.target)&&e.target!==ham){nav.classList.remove("open")}document.querySelectorAll(".lang-dropdown.open").forEach(function(d){if(!d.contains(e.target))d.classList.remove("open")})});
document.querySelectorAll(".nav-links a").forEach(function(a){a.addEventListener("click",function(){var nav=document.querySelector(".nav-links");if(nav)nav.classList.remove("open")})});
