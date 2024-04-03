let initStickyForms = (stickyForms) => {
  let header = document.querySelector("#header");

  stickyForms.forEach(stickyForm => {
    if (stickyForm.closest(".dnd-section")) {
      stickyForm.closest(".dnd-section").classList.add("custom-form-container");
    }

    if (stickyForm.closest(".dnd-column")) {
      let marginTop = parseInt(getComputedStyle(stickyForm)["margin-top"].replace("px", ""));
      stickyForm.closest(".dnd-column").querySelector(".dnd-row").style.position = "sticky";
      stickyForm.closest(".dnd-column").querySelector(".dnd-row").style.top = header ? `${ header.offsetHeight + (marginTop * -1) }px` : 0;
    }
  })
}  