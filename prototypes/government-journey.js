/* Progressive enhancement: the seven points are reading views, not saved progress. */
(() => {
  'use strict';
  const reader = document.querySelector('[data-government-reader]');
  if (!reader) return;
  const tabs = [...reader.querySelectorAll('[data-government-tab]')];
  const panels = [...reader.querySelectorAll('[data-government-panel]')];
  const tablist = reader.querySelector('.gj-stepbar');
  const controls = reader.querySelector('.gj-controls');
  const previous = reader.querySelector('[data-government-prev]');
  const next = reader.querySelector('[data-government-next]');
  const currentLabel = reader.querySelector('.gj-current');
  if (tabs.length !== 7 || panels.length !== 7 || !tablist || !controls || !previous || !next || !currentLabel) return;

  let selected = 0;
  function indexFromHash() {
    const match = /^#government-step-([1-7])$/.exec(window.location.hash);
    return match ? Number(match[1]) - 1 : null;
  }
  function select(index, options = {}) {
    selected = Math.max(0, Math.min(tabs.length - 1, index));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
      panels[i].hidden = i !== selected;
    });
    previous.disabled = selected === 0;
    next.disabled = selected === tabs.length - 1;
    currentLabel.textContent = `กำลังอ่านจุดที่ ${selected + 1} จาก ${tabs.length}`;
    if (options.history) {
      const hash = `#government-step-${selected + 1}`;
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    }
    if (options.focusPanel) panels[selected].focus({ preventScroll: true });
    if (options.scroll) panels[selected].scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'เลือกอ่าน 7 จุดของเส้นทาง');
  tabs.forEach((tab, index) => {
    tab.parentElement.setAttribute('role', 'presentation');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', event => {
      event.preventDefault();
      select(index, { history: true });
    });
    tab.addEventListener('keydown', event => {
      let destination = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') destination = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') destination = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = tabs.length - 1;
      if (destination !== null) {
        event.preventDefault();
        tabs.forEach((item, i) => { item.tabIndex = i === destination ? 0 : -1; });
        tabs[destination].focus();
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(index, { history: true });
      }
    });
  });
  previous.addEventListener('click', () => select(selected - 1, { history: true, focusPanel: true, scroll: true }));
  next.addEventListener('click', () => select(selected + 1, { history: true, focusPanel: true, scroll: true }));
  const restoreFromLocation = () => {
    const index = indexFromHash();
    select(index === null ? 0 : index);
    if (index !== null) panels[index].scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  window.addEventListener('hashchange', restoreFromLocation);
  window.addEventListener('popstate', restoreFromLocation);
  reader.dataset.enhanced = 'true';
  controls.hidden = false;
  const initial = indexFromHash();
  select(initial === null ? 0 : initial);
  if (initial !== null) requestAnimationFrame(() => panels[initial].scrollIntoView({ block: 'start', behavior: 'instant' }));

  const details = [...document.querySelectorAll('details')];
  let beforePrint = null;
  window.addEventListener('beforeprint', () => {
    if (beforePrint === null) beforePrint = details.map(detail => detail.open);
    details.forEach(detail => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (beforePrint !== null) details.forEach((detail, index) => { detail.open = beforePrint[index]; });
    beforePrint = null;
  });
})();
