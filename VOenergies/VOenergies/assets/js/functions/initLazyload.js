let handleLazyElements = (entries, lazyElementsObserver) => {
  entries.map(entry => {
    if (entry.isIntersecting) {

      // If source
      if (entry.target.querySelector('source')) {
        entry.target.querySelectorAll('source').forEach(source => {
          if (source.dataset.srcset) {
            source.srcset = source.dataset.srcset;
          }
        })
      }

      // If src
      if (entry.target.dataset.src) {
        entry.target.src = entry.target.dataset.src;

        if (entry.target.closest('.dnd-column') && entry.target.closest('.dnd-column').previousElementSibling && entry.target.closest('.dnd-section') && entry.target.parentNode.classList.contains('image-container--visual')) {
          entry.target.closest('.dnd-section').classList.add('mobile-reverse');
          entry.target.closest('.dnd-column').classList.add('dnd-column--image');
        }

        if (entry.target.closest('.dnd-column') && entry.target.parentNode.classList.contains('image-container--full-height')) {
          entry.target.closest('.dnd-column').classList.add('dnd-column--full-height');
        }
      }

      // If lazy
      if (entry.target.classList.contains('lazy')) {
        entry.target.classList.add('loaded');
      }
      
      lazyElementsObserver.unobserve(entry.target);
    }
  });
}

let initLazyload = (lazyElements) => {
  if (document.querySelectorAll('.lazy')) {
    let lazyElementsObserver = new IntersectionObserver(handleLazyElements, { 'rootMargin': '0% 0% 50% 0%' });

    document.querySelectorAll('.lazy').forEach(lazyElement => {
      lazyElementsObserver.observe(lazyElement, lazyElementsObserver);
    });
  }
}