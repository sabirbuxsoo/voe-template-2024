let initGalleries = (galleries) => {
  galleries.forEach(gallery => {
    let galleryToggles = gallery.querySelectorAll('.gallery__popup-toggle');

    if (gallery.closest('.dnd-section')) {
      gallery.closest('.dnd-section').classList.add('z-xl');
    }

    galleryToggles.forEach(galleryToggle => {
      galleryToggle.addEventListener('click', () => {
        galleryToggle.closest('.gallery__item').classList.toggle('open');

        if (document.querySelector('body')) {
          document.querySelector('body').classList.toggle('popup-open');
          document.querySelector('body').classList.toggle('o-hidden');
        }
      })
    })
  })
}