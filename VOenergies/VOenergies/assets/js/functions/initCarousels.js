let initCarousels = (carousels) => {
  carousels.forEach(carousel => {
    let autoplay = carousel.dataset.autoplay,
        animation = parseInt(carousel.dataset.duration),
        transition = carousel.dataset.transition,
        loop = carousel.dataset.loop ? carousel.dataset.loop === "true" : false,
        infinite = carousel.dataset.infinite ? carousel.dataset.infinite === "true" : false,
        dots = carousel.dataset.dots === "true",
        arrows = carousel.dataset.arrows === "true",
        centeredSlides = carousel.dataset.centeredSlides === "true",
        loopedSlides = parseInt(carousel.dataset.slides),
        itemsToShowXl = parseInt(carousel.dataset.itemsXl),
        itemsToShowMd = parseInt(carousel.dataset.itemsMd),
        itemsToShowXs = parseInt(carousel.dataset.itemsXs);
    
    let lazyCarouselImages = () => {
      let carouselImages = carousel.querySelectorAll('img.lazy, picture.lazy');

      if(carouselImages.length > 0) {
        carouselImages.forEach(carouselImage => {
          if (carouselImage.dataset.src) {
            carouselImage.src = carouselImage.dataset.src;
          }
          carouselImage.classList.add('loaded');
        })
      }
    }

    let renderIndex = (index, className) => {
      return `<div class=${className}><span class="line"></span></div>`;
    }

    let renderGalleryIndex = (index, className) => {
      let htmlImage = carousel.querySelector(`.swiper-slide:nth-child(${index + 1}) img`).cloneNode([true]);
      return `<div class=${className}>${ htmlImage.outerHTML }</div>`;
    }

    try {
      carousel.swiper = new Swiper(carousel, {
        direction: 'horizontal',
        loop,
        infinite,
        slidesPerView: itemsToShowXs,  
        spaceBetween: 30,
        centeredSlides: centeredSlides,
        loopedSlides: loopedSlides,
        watchSlidesProgress: true,
        centeredSlidesBounds: centeredSlides,
        effect: transition,
        speed: typeof(autoplay) !== "undefined" ? animation : 300,
        pagination: dots ? {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: carousel.classList.contains('carousel--gallery') ? renderGalleryIndex : renderIndex
        } : false,
        navigation: arrows ? {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        } : false,
        autoplay: typeof(autoplay) !== "undefined" ? {
          delay: carousel.dataset.autoplay,
          disableOnInteraction: false,
        } : false,
        breakpoints: {
          {{ theme.layout.xl.breakpoint }}: {
            slidesPerView: itemsToShowXl,
          },
          {{ theme.layout.md.breakpoint }}: {
            slidesPerView: itemsToShowMd,
          },
          {{ theme.layout.xs.breakpoint }}: {
            slidesPerView: itemsToShowXs,
          }
        },
      }, lazyCarouselImages());
    } catch (e) {
      console.log(e, carousel);
    }
  })
}