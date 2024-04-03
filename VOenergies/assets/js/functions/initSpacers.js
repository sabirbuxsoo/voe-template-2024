let initSpacers = (spacers) => {
  spacers.forEach(spacer => {
    spacer.closest(".dnd-column").classList.add("d-none", "d-md-flex");
  })
}