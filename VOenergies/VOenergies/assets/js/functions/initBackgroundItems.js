let initBackgroundItems = (backgroundItems) => {
  backgroundItems.forEach(backgroundItem => {
    if (backgroundItem.closest(".dnd-row")) {
      backgroundItem.closest(".dnd-row").classList.add("dnd-row--background");
    }

    if (backgroundItem.closest(".dnd-section.row-depth-1") && !backgroundItem.closest("footer")) {
      backgroundItem.closest(".dnd-section.row-depth-1").classList.add("p-relative", "o-hidden");
    }
  })
}