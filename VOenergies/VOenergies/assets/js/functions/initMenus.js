let initMenuToggle = (toggle) => {
  toggle.addEventListener('click', () => {
    if (toggle.parentNode) {
      toggle.parentNode.classList.toggle('hs-menu-open');
    }

    if (document.querySelector('body')) {
      document.querySelector('body').classList.toggle('o-hidden');
      document.querySelector('body').classList.toggle('menu-open');
    }
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
      if (toggle.parentNode) {
        toggle.parentNode.classList.remove('hs-menu-open');
      }

      if (document.querySelector('body')) {
        document.querySelector('body').classList.remove('o-hidden');
        document.querySelector('body').classList.remove('menu-open');
      }
    }
  })
}

let initSubmenuToggle = (submenuContainer) => {
  submenuContainer.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    submenuContainer.closest('.hs-item-has-children').classList.toggle('open');
  })
}

let initMobileMenuSpacing = (menuSection, mobileMenuContainer) => {
  mobileMenuContainer.style.paddingTop = `${ menuSection.closest("#header").offsetHeight }px`;

  window.addEventListener("resize", () => {
    mobileMenuContainer.style.paddingTop = `${ menuSection.closest("#header").offsetHeight }px`;
  })
}

let initMobileMenu = (menu) => {
  let menuSection = menu.closest('.dnd-column').parentNode;
  let menuSectionColumns = menuSection.querySelectorAll(":scope > .dnd-column");
  let mobileMenuContainer = document.createElement('div');
  let mobileToggleContainer = document.createElement('div');
  let mobileMenuBackground = menu.closest('header') ? `${ menu.closest('header').dataset.bg }-bg` : 'hs-mobile-menu--basic';

  if (menuSection && menuSectionColumns && !menuSection.closest(".dnd-section").querySelector(".hs-mobile-menu")) {
    mobileMenuContainer.classList.add('hs-mobile-menu', 'row-fluid', 'flex-flow-column', 'd-md-none', mobileMenuBackground);
    mobileToggleContainer.classList.add('span2', 'column', 'd-md-none', 'd-xs-flex', 'align-items-xs-center');

    menuSectionColumns.forEach(menuSectionColumn => {
      if (menuSectionColumn.querySelector('.website-logo')) {
        menuSectionColumn.classList.add('hs-logo-container');
      } else {
        let mobileColumn = menuSectionColumn.cloneNode(true);
        menuSectionColumn.classList.add('d-none', 'd-md-block');
        mobileColumn.classList.add('d-xs-flex', 'd-md-none', 'flex-flow-xs-column-reverse', 'justify-content-xs-flex-end');
        
        if(mobileColumn.querySelector('.search-input')){
            mobileColumn.querySelector('.search-input').closest('.dnd-column').closest('.row-fluid').classList.add('flex-flow-xs-column-reverse', 'flex-flow-md-row-wrap');
        }
        mobileMenuContainer.appendChild(mobileColumn);
      }
    })

    mobileToggleContainer.innerHTML = `<div class='hs-menu-toggle p-relative w-6 h-6'><span></span><span></span><span></span></div>`;
    menuSection.appendChild(mobileToggleContainer);
    menuSection.appendChild(mobileMenuContainer);

    if (menuSection.closest(".header-section")) {
      initMobileMenuSpacing(menuSection, mobileMenuContainer);
    }

    initMenuToggle(mobileToggleContainer);

    let submenuContainers = mobileMenuContainer.querySelectorAll('.hs-menu-children-toggle');

    if (submenuContainers) {
      submenuContainers.forEach(submenuContainer => {
        initSubmenuToggle(submenuContainer);
      })
    }
  }
}

let initMenu = (menu) => {
  let submenuContainers = menu.querySelectorAll('.hs-menu-children-toggle');
  let menuContainer = menu.closest('.container-fluid');
  let menuColumn = menu.closest('.dnd-column');
  
  if(!menu.classList.contains("menu--mega")){
    menu.closest('.row-fluid').classList.add('justify-content-md-flex-end')
    menuColumn.querySelector('.row-fluid-wrapper').classList.add('little-menu', 'border-solid', 'border-md-bottom-thin', 'border-xs-top-thin', 'border-md-top-none', 'border-xs-bottom-none')
  }
  

  if (submenuContainers) {
    submenuContainers.forEach(submenuContainer => {
      initSubmenuToggle(submenuContainer);
    })
  }

  if (menuContainer && menuColumn && (menuContainer.classList.contains('header-section') || menuContainer.classList.contains('footer-section'))) {
    menuColumn.classList.add('flex-grow');
  }
}

let initMenus = (menus) => {
  menus.forEach(menu => {
    initMenu(menu);
    if (menu.closest('header')) {
      initMobileMenu(menu);
    }
  })
}