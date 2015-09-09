'format es6';

import { toggleClass, hasClass } from 'js/dom-helpers';

const toggle = document.getElementById('menu');
const main = document.getElementsByTagName('main')[0];
const nav = document.getElementsByTagName('nav')[0];

toggle.addEventListener('click', function(ev) {
  ev.stopPropagation();
  toggleClass(main, 'active');
  toggleClass(nav, 'active');
});

main.addEventListener('click', function() {
  if (!hasClass(main, 'active')) {
    toggleClass(main, 'active');
    toggleClass(nav, 'active');
  }
});
