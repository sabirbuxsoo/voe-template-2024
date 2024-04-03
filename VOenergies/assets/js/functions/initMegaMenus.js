let initMegaMenu = (megaMenu) => {
	const megaMenuLinks = megaMenu.querySelectorAll(`.megamenu-link`);

	megaMenuLinks.forEach(megaMenuLink => {
		if (megaMenuLink.querySelector(`.megamenu-tabs__content`)) {
			megaMenuLink.querySelector(`.megamenu-tabs__content`).remove();
		}

		megaMenuLink.addEventListener("mouseenter", () => {
			const megaMenuContents = megaMenu.querySelectorAll(`.megamenu-tabs__content`);

			megaMenuLinks.forEach(otherMenuLink => {
				if (otherMenuLink.id === megaMenuLink.id) {
					otherMenuLink.querySelector(".hs-menu-item-link").classList.add("active");
				} else {
					otherMenuLink.querySelector(".hs-menu-item-link").classList.remove("active");
				}
			})

			if (megaMenuContents) {
				megaMenuContents.forEach(megaMenuContent => {
					if (megaMenuContent.id === `${ megaMenuLink.id }-content`) {
						megaMenuContent.classList.add("active");
					} else {
						megaMenuContent.classList.remove("active");
					}
				})
			}
		})
	})

	megaMenu.classList.add("mega-menu--desktop");
	megaMenu.classList.remove("mega-menu--mobile");
}

let initMegaMenuMobile = (megaMenu) => {
	const megaMenuLinks = megaMenu.querySelectorAll(`.megamenu-link`);

	megaMenuLinks.forEach(megaMenuLink => {
		const megaMenuContent = megaMenu.querySelector(`#${ megaMenuLink.id }-content`).cloneNode(true);

		if (megaMenuContent) {
			megaMenuLink.appendChild(megaMenuContent)
		}
	})

	megaMenu.classList.add("mega-menu--mobile");
	megaMenu.classList.remove("mega-menu--desktop");
}

let initMegaMenus = (megaMenus) => {
	megaMenus.forEach(megaMenu => {
		let windowWidth = window.innerWidth;
		let isMobile = megaMenu.classList.contains("mega-menu--mobile");
		let isDesktop = megaMenu.classList.contains("mega-menu--desktop");

		if (windowWidth >= parseInt(document.querySelector("body").dataset.md) && !isDesktop) {
			initMegaMenu(megaMenu)
		} else if (!isMobile) {
			initMegaMenuMobile(megaMenu)
		} 

		window.addEventListener("resize", () => {
			windowWidth = window.innerWidth;
			isMobile = megaMenu.classList.contains("mega-menu--mobile");
			isDesktop = megaMenu.classList.contains("mega-menu--desktop");

			if (windowWidth >= parseInt(document.querySelector("body").dataset.md) && !isDesktop) {
				initMegaMenu(megaMenu)
			} else if (!isMobile) {
				initMegaMenuMobile(megaMenu)
			} 
		})
	})
}