let initHeaderToggle = (headerToggle) => {
  if (headerToggle.closest('.header-menu')) {
    headerToggle.closest('.header-menu').classList.toggle('open');
  }

  if (document.querySelector('body')) {
    document.querySelector('body').classList.toggle('header-open');
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      document.querySelector('body').classList.remove('header-open');
      headerToggle.closest('.header-menu').classList.remove('open');
    }
  })
}