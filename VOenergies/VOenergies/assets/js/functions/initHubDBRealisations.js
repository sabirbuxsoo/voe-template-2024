let fillSearchResults = (response, offset, limit, listing) => {
  try {
    return new Promise ((resolve, reject) => {
      let postsToShow = offset + limit > response.total ? response.total : offset + limit;
      if (response.total > 0 && response.results) {
        listing.querySelector(".row-fluid").innerHTML = ''
        let results = response.results;
        let items = [];

        results.forEach((result, index) => {
          if (index >= offset && index < postsToShow) {
            let newItem = `<div class="span${ 12 / parseInt(listing.dataset.postsPerRow)} columns">
            <picture class="image-container three-four d-flex fw p-relative o-hidden">
              <a class="p-absolute t-0 s-0 fw fh" target="_blank" href="${ result.values.url ? result.values.url : '' }">
                <img class="loaded d-flex p-absolute t-0 s-0 fw fh object-fit-cover" src="${ result.values.image.url }" alt="${ result.values.image.altText}">
                <div class="fw fh p-absolute t-0 s-0 p-8 filter-default-bg filter-default-hover-bg">
                  <div class="display-xs-h4 white-color"><b>${result.values.name}</b></div>
                </div>
                </a>
            </picture>
            </div>`;
            listing.querySelector(".row-fluid").innerHTML += newItem;
          }
        })
      } else {
        resolve();
      }
    })
  } catch (err) {
    console.log(`getSelectedFilters: ${ err }`)
  }
}

let fetchFilteredData = (requestUrl, offset, hubdbContainer) => {
  try {
    return new Promise(async (resolve, reject) => {
      if (requestUrl) {
        const response = await fetch(requestUrl);
        let data = await response.json();

        if (data) {
          resolve({ data: data, offset: offset });
        }
      } else {
        console.log(`fetchFilteredData: no URL received from getSelectedFilters(), received "${ requestUrl }" instead.`);
        resolve(null);
      }
    })
  } catch (err) {
    console.log(`fetchFilteredData: ${ err }`)
  }
}

let initLoadMore = (hubdbContainer, rootUrl, postsTotalNumber, postsPerPage, currentPage, postsStart) => {
  let loadMoreButton =  document.createElement("button"),
      loadMoreContainer = document.createElement("div"),
      pagesNumber = Math.ceil(postsTotalNumber / postsPerPage),
      start = postsStart ? postsStart : postsPerPage;

  if (hubdbContainer.querySelector(".button--load-more")) {
    hubdbContainer.querySelector(".button--load-more").remove();
  }

  if (pagesNumber > 1) {
    loadMoreContainer.classList = "row-fluid d-flex flex-flow-row-wrap justify-content-center mt-10"
    loadMoreButton.classList = "button button--load-more first-color white-hover-color no-bg first-hover-bg first-border-color first-hover-border-color";
    loadMoreButton.textContent = "plus de publications";
    loadMoreButton.dataset.start = start > postsTotalNumber ? postsTotalNumber : start;
    loadMoreButton.dataset.end = start + postsPerPage > postsTotalNumber ? postsTotalNumber : start + postsPerPage;

    loadMoreContainer.appendChild(loadMoreButton);
    hubdbContainer.appendChild(loadMoreContainer);
    
    loadMoreButton.addEventListener('click', async (event) => {
      let results = await fetchFilteredData(rootUrl, hubdbContainer.dataset.offset, hubdbContainer);
      if (results) {
        postsPerPage = postsPerPage + postsPerPage
        fillSearchResults(results.data, parseInt(results.offset), parseInt(loadMoreButton.dataset.end), hubdbContainer);
        initLoadMore(hubdbContainer, rootUrl, postsTotalNumber, postsPerPage, parseInt(event.target.dataset.value), start)
      }
    })
  }
}

let getResults = async (hubdbContainer, rootUrl, event) => {
  let postsPerPage = parseInt(hubdbContainer.dataset.postsPerPage);

    let results = await fetchFilteredData(rootUrl, hubdbContainer.dataset.offset, hubdbContainer);
    if (results) {
      fillSearchResults(results.data, parseInt(results.offset), postsPerPage, hubdbContainer);
      if(hubdbContainer.dataset.onePage == 'false') {
        initLoadMore(hubdbContainer, rootUrl, parseInt(hubdbContainer.dataset.maxItems) - parseInt(results.offset), postsPerPage, 1)        
      }
    }
}

let initHubDBRealisations = (hubdbContainers) => {
  hubdbContainers.forEach(hubdbContainer => {
    let rootUrl = `https://api.hubapi.com/cms/v3/hubdb/tables/${ hubdbContainer.dataset.tid }/rows?portalId=${ hubdbContainer.dataset.pid }`;
    getResults(hubdbContainer, rootUrl);
    hubdbContainer.addEventListener('change', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      getResults(hubdbContainer, rootUrl, event);
    })
  })
}