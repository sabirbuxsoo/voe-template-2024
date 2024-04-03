let getHeaderCurrentScroll = (header, lastScroll) => {
  let currentScroll = window.scrollY;
  let isHeaderFixed = header.classList.contains("header--fixed");

  if (currentScroll > 0) {
    header.classList.add('scrolled');

    if (currentScroll >= lastScroll && !isHeaderFixed) {
      header.classList.add('scrolled--down');
      header.classList.remove('scrolled--up');
    }

    if (currentScroll < lastScroll && !isHeaderFixed) {
      header.classList.add('scrolled--up');
      header.classList.remove('scrolled--down');
    }
  }

  if (window.scrollY <= 0) {
    header.classList.remove('scrolled');

    if (!isHeaderFixed) {
      header.classList.remove('scrolled--down');
      header.classList.remove('scrolled--up');
    }
  }
}

let initHeaders = (headers) => {
  headers.forEach(header => {
    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
      getHeaderCurrentScroll(header, lastScroll);
      lastScroll = window.scrollY;
    })

    window.addEventListener('resize', () => {
      getHeaderCurrentScroll(header, lastScroll);
      lastScroll = window.scrollY;
    })
  })
}
