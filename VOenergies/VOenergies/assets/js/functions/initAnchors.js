let initAnchors = (anchors) => {
  if (anchors) {
    anchors.forEach(anchor => {
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (anchor.dataset.target.length > 0) {
					
          let target = document.querySelector(`${anchor.dataset.target}`),
							header = document.querySelector("header"),
              offsetTarget = target.getBoundingClientRect().top;
					
          window.scroll({ 
						top: offsetTarget - (header ? header.offsetHeight : 0), 
						left: 0, 
						behavior: 'smooth'
					});
        }
      })
    })
  }
}