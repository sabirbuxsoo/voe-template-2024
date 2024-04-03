document.addEventListener("DOMContentLoaded", () => {
	let loadScripts = async (scripts) => {
		return new Promise((resolve, reject) => {
			for(let i = 0; i < scripts.length; i++) {
				const scriptElement = document.createElement('script');

				scriptElement.id = scripts[i].id;
				scriptElement.src = scripts[i].url;
				scriptElement.async = scripts[i].async;

				document.querySelector(scripts[i].position).appendChild(scriptElement);

				scriptElement.onload = () => {
					scriptElement.dataset.loaded = true;
					if (i == scripts.length - 1) { resolve(true); }
				}
			}
		})
	},
			scriptsToLoad = [];

	if (document.querySelectorAll('.anchors-menu').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initAnchorsMenu.js') }}`, id: "anchors-menus-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.accordion').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initAccordions.js') }}`, id: "accordions-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.animation').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./libraries/anime.js') }}`, id: "anime-script", async: true, position: ".body-container-outer" }); scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initAnimations.js') }}`, id: "animations-script", async: true, position: ".body-container-outer" }); }
	if (document.querySelectorAll('.carousel').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./libraries/swiper.js') }}`, id: "swiper-script", async: true, position: ".body-container-outer" }); scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initCarousels.js') }}`, id: "carousels-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.gallery.gallery--lightbox').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initGalleries.js') }}`, id: "galleries-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('#header').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initHeaders.js') }}`, id: "headers-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.key-numbers').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initKeyNumbers.js') }}`, id: "key-numbers-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.lazy').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initLazyload.js') }}`, id: "lazyload-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.menu').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initMenus.js') }}`, id: "menus-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.hs-search-results').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initSearchResults.js') }}`, id: "search-results-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.search-input__search-toggle').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initSearchToggles.js') }}`, id: "search-toggles-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.social-follow__icon.social-follow__icon--window').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initWindowOpeners.js') }}`, id: "window-openers-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelector('.body-container-wrapper .dnd-section.row-depth-1') && document.querySelector('#header')) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initFirstSectionTopSpacing.js') }}`, id: "first-section-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.background-items').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initBackgroundItems.js') }}`, id: "background-items-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.anchor-link').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initAnchors.js') }}`, id: "anchors-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.hs-horizontal-spacer').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initSpacers.js') }}`, id: "spacers-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.video').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initVideos.js') }}`, id: "videos-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.hubdb-tags').length > 0 && document.querySelector('.hubdb-listing__listing')) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initHubDBTags.js') }}`, id: "hubdb-tags-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelector('.blog-tags__container')) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initBlogTags.js') }}`, id: "blog-tags-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelector('.hubdb-listing__load-more-button')) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initHubDBRealisations.js') }}`, id: "realisations-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.hubdb-listing-body-realisations').length > 0 && document.querySelector('.hubdb-listing-body')) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initHubDBRealisations.js') }}`, id: "realisations-tags-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll('.megamenu-tabs').length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initMegaMenus.js') }}`, id: "megamenus-script", async: true, position: ".body-container-outer" }) }
	if (document.querySelectorAll(".custom-form").length > 0) { scriptsToLoad.push({ url: `{{ get_asset_url('./functions/initStickyForms.js') }}`, id: "sicky-forms-script", async: true, position: ".body-container-outer" }) }

	loadScripts(scriptsToLoad).then((response) => {
		document.addEventListener('readystatechange', event => {
			if (response && document.readyState === "complete") {        
				if (document.querySelectorAll('.anchors-menu').length > 0) { initAnchorsMenu(document.querySelectorAll('.anchor-able')); }
				if (document.querySelectorAll('.accordion').length > 0) { initAccordions(document.querySelectorAll('.accordion')); }
				if (document.querySelectorAll('.carousel').length > 0) { initCarousels(document.querySelectorAll('.carousel')); }
				if (document.querySelectorAll('.key-numbers').length > 0) { initKeyNumbers(document.querySelectorAll('.key-numbers')); }
				if (document.querySelectorAll('.gallery.gallery--lightbox').length > 0) { initGalleries(document.querySelectorAll('.gallery.gallery--lightbox')); }
				if (document.querySelectorAll('#header').length > 0) { initHeaders(document.querySelectorAll('#header')); }
				if (document.querySelectorAll('.lazy').length > 0) { initLazyload(document.querySelectorAll('.lazy')); }
				if (document.querySelectorAll('.menu').length > 0) { initMenus(document.querySelectorAll('.menu')); }
				if (document.querySelectorAll('.hs-search-results').length > 0) { initSearchResults(document.querySelectorAll('.hs-search-results')); }
				if (document.querySelectorAll('.search-input__search-toggle').length > 0) { initSearchToggles(document.querySelectorAll('.search-input__search-toggle')); }
				if (document.querySelectorAll('.social-follow__icon.social-follow__icon--window').length > 0) { initWindowOpeners(document.querySelectorAll('.social-follow__icon.social-follow__icon--window')); }
				if (document.querySelector('.body-container-wrapper .dnd-section.row-depth-1') && document.querySelector('#header')) { initFirstSectionTopSpacing(document.querySelector('.body-container-wrapper .dnd-section.row-depth-1'), document.querySelector('#header')); }
				if (document.querySelectorAll('.animation').length > 0) { initAnimations(document.querySelectorAll('.animation')); }
				if (document.querySelectorAll('.background-items').length > 0) { initBackgroundItems(document.querySelectorAll('.background-items')); }
				if (document.querySelectorAll('.anchor-link').length > 0) { initAnchors(document.querySelectorAll('.anchor-link')); }
				if (document.querySelectorAll('.hs-horizontal-spacer').length > 0) { initSpacers(document.querySelectorAll('.hs-horizontal-spacer')); }
				if (document.querySelectorAll('.video').length > 0) { initVideos(document.querySelectorAll('.video')); }
				if (document.querySelectorAll('.hubdb-tags').length > 0 && document.querySelector('.hubdb-listing__listing')) { initHubDBTags(document.querySelectorAll('.hubdb-tags'), document.querySelectorAll('.hubdb-listing__listing')); }
				if (document.querySelector('.blog-tags__container')) { initBlogTags(document.querySelector('.blog-tags__container')); }
				if (document.querySelectorAll('.hubdb-listing-body-realisations').length > 0) { initHubDBRealisations(document.querySelectorAll('.hubdb-listing-body-realisations')); }
				if (document.querySelectorAll('.megamenu-tabs').length > 0) { initMegaMenus(document.querySelectorAll('.megamenu-tabs')); }
				if (document.querySelectorAll(".custom-form.custom-form--sticky").length > 0) { initStickyForms(document.querySelectorAll('.custom-form.custom-form--sticky')); }

				// HubSpot Editor - Init lazyload on module changes
				window.addEventListener('message', event => {
					if (event.data && event.data.body && event.data.body.action && event.data.body.action == "htmlReceivedForModule") {
						if (document.querySelectorAll('.lazy').length > 0) { initLazyload(document.querySelectorAll('.lazy')); }
						if (document.querySelectorAll('.carousel').length > 0 ) { initSwiper(); initCarousels(document.querySelectorAll('.carousel')) }
						if (document.querySelectorAll('.key-number__number').length > 0) { initKeyNumbers(document.querySelectorAll('.key-number__number')); }
					}
				});
			}
		});
	})
})