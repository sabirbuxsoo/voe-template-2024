let initAnchorsMenu = (anchors) => {
  const anchorsMenu = document.querySelector('.anchors-menu');

  let initAnchorLink = (anchorHtmlElement) => {
    if (anchorHtmlElement.dataset.href) {
      let target = document.querySelector(`${ anchorHtmlElement.dataset.href }`),
          offsetTarget = target.offsetTop;

      window.scroll({ top: offsetTarget, left: 0, behavior: 'smooth' });
    }
  }

  if (anchorsMenu && anchors) {
    let anchorsList = document.createElement('ul');

    anchors.forEach(anchor => {
      let anchorHtmlListElement = document.createElement('li');
      let anchorHtmlElement = document.createElement('a');

      anchorHtmlElement.dataset.href = `#${ anchor.id }`;
      anchorHtmlElement.textContent = `${ anchor.dataset.name }`;
      anchorHtmlElement.addEventListener('click', () => initAnchorLink(anchorHtmlElement));

      anchorHtmlListElement.appendChild(anchorHtmlElement);
      anchorsList.appendChild(anchorHtmlListElement);
    })

    anchorsMenu.appendChild(anchorsList);
  }
}