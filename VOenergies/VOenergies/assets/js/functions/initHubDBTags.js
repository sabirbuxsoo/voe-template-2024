let showLoading = (hubdbListingContainer, hubdbListingFilters) => {
	return new Promise((resolve, reject) => {
		try {
			hubdbListingContainer.innerHTML += `<div class="hubdb-listing__loading"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>`;
			hubdbListingContainer.classList.add("hubdb-listing--loading");

			hubdbListingFilters.forEach(productsFilter => {
				productsFilter.classList.add("products-filters--loading");
			})

			resolve();
		} catch (err) {
			reject(err)
		}
	})
}

let hideLoading = (hubdbListingContainer, hubdbListingFilters) => {	
	return new Promise((resolve, reject) => {
		try {
			hubdbListingContainer.classList.remove("hubdb-listing--loading");

			hubdbListingFilters.forEach(productsFilter => {
				productsFilter.classList.remove("products-filters--loading");
			})
			resolve();
		} catch (err) {
			reject(err)
		}
	})
}

let resetFilters = (baseUrl, hubdbListingFilter) => {
	return new Promise((resolve, reject) => {
		let requestUrl = baseUrl;
		let requestFilters = new URLSearchParams(window.location.search);
		let currentFilters = hubdbListingFilter.querySelectorAll("input:not([value='all']):checked");
		let resetFilter = hubdbListingFilter.querySelector("input[value='all']");
		let searchFilter = hubdbListingFilter.querySelector(".hs-search-field__input");

		if (resetFilter) { resetFilter.checked = true }

		if (searchFilter) {
			requestFilters.delete(`${ searchFilter.dataset.name }`);
		}

		if (currentFilters) {
			currentFilters.forEach(currentFilter => {
				currentFilter.checked = false;
				requestFilters.delete(`${ currentFilter.dataset.name }`);
			})
		}

		if (requestFilters.size > 0) {
			requestUrl = `${baseUrl}&${requestFilters.toString()}`;
		}

		resolve(requestUrl);
	})
}

let getCurrentFilters = (baseUrl, hubdbListingFilters) => {
	return new Promise((resolve, reject) => {
		let requestFilters = [];

		hubdbListingFilters.forEach(hubdbListingFilter => {
			let currentFilters = hubdbListingFilter.querySelectorAll("input:not([value='all']):checked, input[type='text']");

			if (currentFilters.length > 0) {
				currentFilters.forEach(currentFilter => {
					console.log(currentFilter)
					let resetFilter = hubdbListingFilter.querySelector(`input[data-name='${ currentFilter.dataset.name }'][value='all']:checked`);
					if (currentFilter.type == "checkbox") {
						requestFilters.push(`${ currentFilter.dataset.name }=${ encodeURIComponent(currentFilter.value) }`)
					} 

					if (currentFilter.type == "text" && currentFilter.value.length >= 3) {
						requestFilters.push(`${ currentFilter.dataset.name }=${ encodeURIComponent(currentFilter.value) }`)
					}

					if (resetFilter) { resetFilter.checked = false }
				})
			} else {
				resetFilters(baseUrl, hubdbListingFilter);
			}
		})

		if (requestFilters.length > 0) {
			let requestUrl = `${baseUrl}&${requestFilters.join("&")}`;
			resolve(requestUrl);
		} else {
			resolve(baseUrl);
		}
	})
}

let setWindowFilters = (hubdbListingFilters) => {
	return new Promise((resolve, reject) => {
		let requestFilters = new URLSearchParams(window.location.search);

		requestFilters.delete("page")
		requestFilters.delete("hsCacheBuster")

		if (requestFilters.size > 0) {
			hubdbListingFilters.forEach(hubdbListingFilter => {
				for (const [key, value] of requestFilters.entries()) {
					let resetFilter = hubdbListingFilter.querySelector(`input[data-name='${ key }'][value="all"]`);
					let currentFilters = hubdbListingFilter.querySelectorAll(`input[value='${ value.split(' ').join('+') }']`);

					currentFilters.forEach(currentFilter => {
						currentFilter.checked = true
					})

					if (resetFilter) {
						resetFilter.checked = false;
					}
				}
			})
		}

		resolve();
	})
}

let searchHubdb = async (baseUrl, requestUrl, hubdbListingContainer) => {
	return new Promise(async(resolve, reject) => {
		let response = await fetch(requestUrl);
		let data = await response.json();
		let listingUrl = [location.protocol, '//', location.host, location.pathname].join('');
		let requestSearchParams = new URL(requestUrl).searchParams;
		let stateUrl = window.location.pathname;

		requestSearchParams.delete("portalId")
		baseUrl = requestUrl;	

		if (requestSearchParams.toString().length > 0) {
			stateUrl = window.location.pathname + "?" + requestSearchParams.toString();
		}

		if (data.results && data.results.length > 0) {
			let resultsListing = [];

			data.results.forEach((result, index) => {
				if (index < parseInt(hubdbListingContainer.dataset.items)) {
					let resultBody = `<div class="span4 columns hubdb-listing__hubdb-post ">
					<article class=" rounded-large no-bg gray-border-color border-solid border-thin o-hidden pt-0 pb-0 ps-0 pe-0 fh">
					<div class="hubdb-listing__hubdb-post-link p-relative d-flex flex-flow-column align-items-flex-start justify-content-flex-start fh">
					<a class="p-absolute t-0 s-0 fw fh z-sm" href="${ result.path ? `${ window.location.href.split('?')[0] }/${ result.path }` : result.values.link }"></a>
					<div class="image-container p-relative d-flex square rounded-large o-hidden mb-0 no-bg">
					<img class="lazy object-fit-cover t-0 s-0 fw fh p-absolute loaded" src="${ result.values.image.url }" alt="${ result.values.image.altText }">
					</div>
					<div class="d-flex flex-flow-column align-items-flex-start justify-content-xs-center flex-grow pt-6 pb-6 ps-6 pe-6">
					<div class="post-infos mb-4 d-flex flex-flow-row-wrap align-items-center gap-2">
					<span class="post-infos__types">
					<span class="post-infos__type">${ result.values.type ? result.values.type.label : '' }</span>
					</span>
					</div>
					<div class="display-xs-h5 display-md-h3 hubdb-listing__hubdb-post-title first-color mb-2"><b>${ result.values.title }</b></div>
					<div class="hubdb-listing__hubdb-post-description mb-4">
					${ result.values.description }
					</div>
					<div class="button-container mt-auto fw p-relative z-md d-flex flex-flow-row-wrap align-items-xs-center justify-content-space-between">
					<a href="${ result.path ? `${ window.location.href.split('?')[0] }/${ result.path }` : result.values.link }" class="link  d-inline-flex align-items-xs-center justify-content-xs-center">
					Lire la suite <svg class="ms-1 w-5 h-5" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1 5.25a.75.75 0 000 1.5v-1.5zm14.53 1.28a.75.75 0 000-1.06L10.757.697a.75.75 0 00-1.06 1.06L13.939 6l-4.242 4.243a.75.75 0 001.06 1.06L15.53 6.53zM1 6.75h14v-1.5H1v1.5z"></path></svg>
					</a>
					</div>
					</div>
					</div>
					</article>
					</div>`;

					resultsListing.push(resultBody);
				}

				if (index === data.results.length - 1 || index === parseInt(hubdbListingContainer.dataset.items) - 1) {
					hubdbListingContainer.innerHTML = resultsListing.join("");
					history.pushState({}, "", stateUrl);
					resolve({ data: data, url: requestUrl});
				}
			})
		} else {
			let resultBody = `<div class="span12 columns d-flex flex-flow-column align-items-center justify-content-center"><p class="text-align-center">Désolé, il n'y a pas de résultat pour votre recherche.<br>Veuillez changer de critères pour réessayer.</p></div>`;

			hubdbListingContainer.innerHTML = resultBody;
			history.pushState({}, "", stateUrl);
			resolve({ data: data, url: requestUrl });
		}
	})
}

let initPagination = (productsData, hubdbListingContainer) => {
	let paginationContainer = hubdbListingContainer.parentNode.querySelector(".hubdb-listing__pagination");
	let total = productsData.data.total;
	let requestUrl = productsData.url;
	let posts_to_show = hubdbListingContainer.dataset.items;
	let total_page_count = Math.ceil(total / posts_to_show);
	let params = new URL(window.location).searchParams;
	let page = params.get("page");
	let current_page_num = page ? parseInt(page) : 1;
	let requestSearchParams = new URL(requestUrl).searchParams;
	requestSearchParams.delete("portalId")

	let pagination = `<div class="span12 columns">
				<nav class="hubdb-listing__pagination fw">
					<ul class="d-flex flex-flow-row-wrap align-items-center justify-content-center m-n-2">
						<li class="hubdb-listing__pagination-item">
							<a class="hubdb-listing__pagination-item-link d-flex flex-flow-column align-items-center p-2${ current_page_num == 1 ? " hubdb-listing__pagination-item-link--disabled" : "" }" href="${ current_page_num > 1 ? window.location.pathname + requestSearchParams.toString() : "javascript:;" }">
								<svg viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.216 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L5.046 15.146 16.708 3.483a1.5 1.5 0 10-2.121-2.121l-12.37 12.37z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.216 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L15.046 15.146 26.708 3.483a1.5 1.5 0 10-2.121-2.121l-12.37 12.37z"fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.216 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L5.046 15.146 16.708 3.483a1.5 1.5 0 10-2.121-2.121l-12.37 12.37z"fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.216 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L15.046 15.146 26.708 3.483a1.5 1.5 0 10-2.121-2.121l-12.37 12.37z"fill="currentColor"/></svg>
							</a>
						</li>
						<li class="hubdb-listing__pagination-item">
							<a class="hubdb-listing__pagination-item-link d-flex flex-flow-column align-items-center prev p-2${ current_page_num - 1 < 1 ? " hubdb-listing__pagination-item-link--disabled" : "" }" href="${ current_page_num - 1 >= 1 ? window.location.pathname + (current_page_num - 1 > 1 ? "?page=" + (current_page_num - 1) + "&" + requestSearchParams.toString() : "?" + requestSearchParams.toString()) : "javascript:;" }">
								<svg viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.451 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L4.28 15.146 15.943 3.483a1.5 1.5 0 00-2.121-2.121l-12.37 12.37z"fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1.451 13.732a2 2 0 000 2.828l12.37 12.37a1.5 1.5 0 002.121-2.121L4.28 15.146 15.943 3.483a1.5 1.5 0 00-2.121-2.121l-12.37 12.37z"fill="currentColor"/></svg>
							</a>
						</li>
						${ current_page_num - 2 >= 1 ? (`<li class="hubdb-listing__pagination-item"><a class="hubdb-listing__pagination-item-link p-2" href="${ window.location.pathname + (current_page_num - 2 > 1 ? "?page=" + (current_page_num - 2) + "&" + requestSearchParams.toString() : "?" + requestSearchParams.toString()) }">${ current_page_num - 2 }</a></li>`) : '' }
						${ current_page_num - 1 >= 1 ? (`<li class="hubdb-listing__pagination-item"><a class="hubdb-listing__pagination-item-link p-2" href="${ window.location.pathname + (current_page_num - 1 > 1 ? "?page=" + (current_page_num - 1) + "&" + requestSearchParams.toString() : "?" + requestSearchParams.toString()) }">${ current_page_num - 1 }</a></li>`) : '' }
						<li class="hubdb-listing__pagination-item"><span class="hubdb-listing__pagination-item-link hubdb-listing__pagination-item-link--current p-2">${ current_page_num }</span></li>
						${ current_page_num + 1 <= total_page_count ? (`<li class="hubdb-listing__pagination-item"><a class="hubdb-listing__pagination-item-link p-2" href="${ window.location.pathname + "?page=" + (current_page_num + 1) + "&" + requestSearchParams.toString() }">${ current_page_num + 1 }</a></li>`) : '' }
						${ current_page_num + 2 <= total_page_count ? (`<li class="hubdb-listing__pagination-item"><a class="hubdb-listing__pagination-item-link p-2" href="${ window.location.pathname + "?page=" + (current_page_num + 2) + "&" + requestSearchParams.toString() }">${ current_page_num + 2 }</a></li>`) : '' }
						<li class="hubdb-listing__pagination-item">
							<a class="hubdb-listing__pagination-item-link d-flex flex-flow-column align-items-center next p-2${ current_page_num + 1 > total_page_count ? " hubdb-listing__pagination-item-link--disabled" : "" }" href="${ current_page_num + 1 <= total_page_count ? window.location.pathname + "?page=" + (current_page_num + 1) + "&" + requestSearchParams.toString() : "javascript:;" }">
								<svg viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.606 16.56a2 2 0 000-2.828L3.236 1.362a1.5 1.5 0 00-2.121 2.121l11.662 11.663L1.115 26.81a1.5 1.5 0 102.121 2.121l12.37-12.37z"fill="currentColor"/></svg>
							</a>
						</li>
						<li class="hubdb-listing__pagination-item">
							<a class="hubdb-listing__pagination-item-link d-flex flex-flow-column align-items-center last p-2${ current_page_num == total_page_count ? " hubdb-listing__pagination-item-link--disabled" : "" }" href="${ current_page_num < total_page_count ? window.location.pathname + "?page=" + total_page_count + "&" + requestSearchParams.toString() : "javascript:;" }">
								<svg viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M25.84 16.56a2 2 0 000-2.828L13.47 1.362a1.5 1.5 0 00-2.121 2.121l11.663 11.663L11.35 26.81a1.5 1.5 0 002.121 2.121l12.37-12.37z"fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.84 16.56a2 2 0 000-2.828L3.47 1.362A1.5 1.5 0 001.35 3.483l11.663 11.663L1.35 26.81A1.5 1.5 0 103.47 28.93l12.37-12.37z"fill="currentColor"/></svg>
							</a>
						</li>
					</ul>
				</nav>
			</div>`;

	if (paginationContainer) {
		if (total_page_count > 1) {
			paginationContainer.innerHTML = pagination;
		} else {
			paginationContainer.remove();
		}
	} else {
		if (total_page_count > 1) {    
			let newPaginationContainer = document.createElement("div");

			newPaginationContainer.classList.add("hubdb-listing__pagination", "row-fluid", "justify-content-flex-start", "p-relative", "mt-20")
			newPaginationContainer.innerHTML = pagination;
			hubdbListingContainer.parentNode.appendChild(newPaginationContainer);
		}
	}
}

let initHubDBTags = async (hubdbListingFilters, hubdbListingContainers) => {
	hubdbListingContainers.forEach(hubdbListingContainer => {
		let baseUrl = 'https://api.hubapi.com/cms/v3/hubdb/tables/' + hubdbListingContainer.dataset.tid + '/rows?portalId=' + hubdbListingContainer.dataset.pid,
				queryString;


		if (hubdbListingContainer && hubdbListingFilters) {
			hubdbListingFilters.forEach(hubdbFilter => {
				let currentFilters = new URL(window.location).searchParams;
				let currentFiltersArray = Array.from(currentFilters.entries());
				let hubdbFilterInputs = hubdbFilter.querySelectorAll("input[type='checkbox']");
				let hubdbFilterSearchs = hubdbFilter.querySelectorAll(".search-input");

				setWindowFilters(hubdbListingFilters);

				if (hubdbFilterInputs) {
					hubdbFilterInputs.forEach(hubdbFilterInput => {
						hubdbFilterInput.addEventListener("click", async(event) => {
							if (hubdbFilterInput.value === 'all') {
								showLoading(hubdbListingContainer, hubdbListingFilters)
									.then(() => resetFilters(baseUrl, hubdbFilterInput.closest(".hubdb-tags")))
									.then(requestUrl => searchHubdb(baseUrl, requestUrl, hubdbListingContainer))
									.then(productsData => initPagination(productsData, hubdbListingContainer))
									.then(() => hideLoading(hubdbListingContainer, hubdbListingFilters))
							} else {
								showLoading(hubdbListingContainer, hubdbListingFilters)
									.then(() => getCurrentFilters(baseUrl, hubdbListingFilters))
									.then(requestUrl => searchHubdb(baseUrl, requestUrl, hubdbListingContainer))
									.then(productsData => initPagination(productsData, hubdbListingContainer))
									.then(() => hideLoading(hubdbListingContainer, hubdbListingFilters))
							}
						})
					})
				}

				if (hubdbFilterSearchs) {
					hubdbFilterSearchs.forEach(hubdbFilterSearch => {
						let searchInput = hubdbFilterSearch.querySelector("input[type='text']"),
								searchButton = hubdbFilterSearch.querySelector("button");

						if (searchInput && searchButton) {
							searchButton.addEventListener("click", async(event) => {
								event.preventDefault();
								event.stopPropagation();

								let currentSearchValue = searchInput.value;

								if (currentSearchValue.length >= 3) {
									showLoading(hubdbListingContainer, hubdbListingFilters)
										.then(() => getCurrentFilters(baseUrl, hubdbListingFilters))
										.then(requestUrl => searchHubdb(baseUrl, requestUrl, hubdbListingContainer))
										.then(productsData => initPagination(productsData, hubdbListingContainer))
										.then(() => hideLoading(hubdbListingContainer, hubdbListingFilters))
								} else if (currentSearchValue.length === 0) {
									showLoading(hubdbListingContainer, hubdbListingFilters)
										.then(() => resetFilters(baseUrl, searchButton.closest(".hubdb-tags")))
										.then(requestUrl => searchHubdb(baseUrl, requestUrl, hubdbListingContainer))
										.then(productsData => initPagination(productsData, hubdbListingContainer))
										.then(() => hideLoading(hubdbListingContainer, hubdbListingFilters))
								}
							})
						}
					})
				}
			})
		}
	})
}