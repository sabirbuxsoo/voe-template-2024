let initSearchToggles = (searchToggles) => {
  searchToggles.forEach(searchToggle => {
    searchToggle.addEventListener('click', () => {
      searchToggle.parentNode.classList.toggle('search-input--open');
    })
  })
}