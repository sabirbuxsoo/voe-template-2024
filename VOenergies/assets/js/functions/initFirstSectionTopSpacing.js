let initFirstSectionTopSpacing = (firstSection, header) => {
  firstSection.querySelector(".row-fluid").style.paddingTop = `${ header.offsetHeight }px`;

  window.addEventListener("resize", () => {
    firstSection.querySelector(".row-fluid").style.paddingTop = `${ header.offsetHeight }px`;
  })
}