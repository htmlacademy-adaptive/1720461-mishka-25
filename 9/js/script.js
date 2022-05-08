let navMain = document.querySelector('.main-navigation');
let navToggle = document.querySelector('.main-navigation__toogle');

navMain.classList.remove('main-navigation--nojavascript');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-navigation--closed')) {
    navMain.classList.remove('main-navigation--closed');
    navMain.classList.add('main-navigation--opened');
  } else {
    navMain.classList.add('main-navigation--closed');
    navMain.classList.remove('main-navigation--opened');
  }
});
