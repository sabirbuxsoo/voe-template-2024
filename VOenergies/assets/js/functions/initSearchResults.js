let initSearchResults = () => {
	let hsResultsPage = (_resultsClass) => {
		let buildResultsPage = (_instance) => {
			let resultTemplate = _instance.querySelector('.hs-search-results__template'),
					resultsSection = _instance.querySelector('.hs-search-results__listing'),
					searchPath = _instance.querySelector('.hs-search-results__pagination').getAttribute('data-search-path'),
					prevLink = _instance.querySelector('.hs-search-results__prev-page'),
					nextLink = _instance.querySelector('.hs-search-results__next-page'),
					defaultImage = _instance.dataset.fallback;

			let searchParams = new URLSearchParams(window.location.search.slice(1));

			let getTerm = () => {
				return searchParams.get('term') || '';
			}

			let getOffset = () => {
				return parseInt(searchParams.get('offset')) || 0;
			}

			let getLimit = () => {
				return parseInt(searchParams.get('limit'));
			}

			let addResult = (title, url, description, featuredImage) => {
				let newResult = document.importNode(resultTemplate.content, true);

				let isFeaturedImageEnabled = () => {
					if (newResult.querySelector('.hs-search-results__featured-image > img')) {
						return true;
					}
				}

				newResult.querySelector('.hs-search-results__title').innerHTML = title;
				newResult.querySelector('.hs-search-results__link .button').href = url;
				newResult.querySelector('.hs-search-results__description').innerHTML = description;

				if (isFeaturedImageEnabled()) {
					if (typeof featuredImage !== 'undefined') {
						newResult.querySelector('.hs-search-results__featured-image > img').src = featuredImage;
					} else {
						newResult.querySelector('.hs-search-results__featured-image > img').src = defaultImage;
					}
				}

				resultsSection.appendChild(newResult);
			}

			let fillResults = (results) => {
				results.results.forEach(function(result, i) {
					addResult(
						result.title,
						result.url,
						result.description,
						result.featuredImageUrl
					);
				});
			}

			let emptyPagination = () => {
				prevLink.remove();
				nextLink.remove();
			}

			let emptyResults = (searchedTerm) => {
				if (document.querySelector(".system-page") && document.querySelector(".system-page").dataset.error) {
					resultsSection.innerHTML = `<div class="hs-search__no-results"><p>${ decodeURIComponent(document.querySelector(".system-page").dataset.error).replaceAll("[keyword]", searchedTerm).replaceAll("+", " ") }</p></div>`;
				} else {
					resultsSection.innerHTML = `<div class="hs-search__no-results"><p>Sorry. There are no results for "${ searchedTerm }"</p><p>Try rewording your query, or browse through our site.</p></div>`;
				}
			}

			let setSearchBarDefault = (searchedTerm) => {
				let searchBars = document.querySelectorAll('.hs-search-field__input');
				Array.prototype.forEach.call(searchBars, function(el) {
					el.value = searchedTerm;
				});
			}

			let httpRequest = (term, offset) => {
				let SEARCH_URL = '/_hcms/search?',
						requestUrl = SEARCH_URL + searchParams + '&analytics=true',
						request = new XMLHttpRequest();

				request.open('GET', requestUrl, true);
				request.onload = function() {
					if (request.status >= 200 && request.status < 400) {
						let data = JSON.parse(request.responseText);
						setSearchBarDefault(data.searchTerm);
						if (data.total > 0) {
							fillResults(data);
							paginate(data);
						} else {
							emptyResults(data.searchTerm);
							emptyPagination();
						}
					} else {
						console.error('Server reached, error retrieving results.');
					}
				};
				request.onerror = function() {
					console.error('Could not reach the server.');
				};
				request.send();
			}

			let paginate = (results) => {
				let updatedLimit = getLimit() || results.limit;

				function hasPreviousPage() {
					return results.page > 0;
				}
				function hasNextPage() {
					return results.offset <= results.total - updatedLimit;
				}

				if (hasPreviousPage()) {
					let prevParams = new URLSearchParams(searchParams.toString());
					prevParams.set(
						'offset',
						results.page * updatedLimit - parseInt(updatedLimit)
					);
					prevLink.href = '/' + searchPath + '?' + prevParams;
				} else {
					prevLink.parentNode.removeChild(prevLink);
				}

				if (hasNextPage()) {
					let nextParams = new URLSearchParams(searchParams.toString());
					nextParams.set(
						'offset',
						results.page * updatedLimit + parseInt(updatedLimit)
					);
					nextLink.href = '/' + searchPath + '?' + nextParams;
				} else {
					nextLink.parentNode.removeChild(nextLink);
				}
			}

			let getResults = (function() {
				if (getTerm()) {
					httpRequest(getTerm(), getOffset());
				} else {
					emptyPagination();
				}
			})();
		}
		(function() {
			let searchResults = document.querySelectorAll(_resultsClass);
			Array.prototype.forEach.call(searchResults, function(el) {
				buildResultsPage(el);
			});
		})();
	};

	if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
		let resultsPages = hsResultsPage('div.hs-search-results');
	} else {
		document.addEventListener('DOMContentLoaded', function() {
			let resultsPages = hsResultsPage('div.hs-search-results');
		});
	}
}