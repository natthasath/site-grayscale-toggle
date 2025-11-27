(function(){
  var STORAGE_KEY = 'sgt_pref'; // 'on' or 'off'
  var CLASS_ON = 'is-grayscale';

  function applyState(state){
    var html = document.documentElement;
    if(state === 'on'){
      if(!html.classList.contains(CLASS_ON)) html.classList.add(CLASS_ON);
    } else {
      html.classList.remove(CLASS_ON);
    }
    document.querySelectorAll('[data-sgt-toggle]').forEach(function(btn){
      var on = (state === 'on');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var labelOn = btn.getAttribute('data-label-on') || (window.SGT_I18N && SGT_I18N.labelOn) || 'Grayscale: ON';
      var labelOff = btn.getAttribute('data-label-off') || (window.SGT_I18N && SGT_I18N.labelOff) || 'Grayscale: OFF';
      var labEl = btn.querySelector('[data-sgt-label]');
      if (labEl) labEl.textContent = on ? labelOn : labelOff;
    });
  }

  function getDefaultState(){
    var html = document.documentElement;
    var def = html.getAttribute('data-sgt-default') || 'on';
    return (def === 'off') ? 'off' : 'on';
  }

  function getStoredState(){
    try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }
  function setStoredState(val){
    try { localStorage.setItem(STORAGE_KEY, val); } catch(e){}
  }

  function currentState(){
    var s = getStoredState();
    return (s === 'on' || s === 'off') ? s : getDefaultState();
  }

  function toggle(){
    var next = currentState() === 'on' ? 'off' : 'on';
    setStoredState(next);
    applyState(next);
  }

  // Public API
  window.SGT = { applyState: applyState, currentState: currentState, toggle: toggle };

  document.addEventListener('DOMContentLoaded', function(){
    document.body.addEventListener('click', function(e){
      var t = e.target.closest('[data-sgt-toggle]');
      if(!t) return;
      e.preventDefault();
      toggle();
    });
    applyState(currentState());
  });
})(); 
