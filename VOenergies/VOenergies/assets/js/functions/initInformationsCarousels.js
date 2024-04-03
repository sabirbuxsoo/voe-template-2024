let initInformationsCarousels = (informationsCarousels) => {
  informationsCarousels.forEach(informationsCarousel => {
    try {
      informationsCarousel.swiper = new Swiper(informationsCarousel, {
        slidesPerView: "auto",
        direction: 'horizontal',
        centeredSlides: true,
        freeMode: false,
				allowTouchMove: false,
        loop: true,
        infinite: true,
        spaceBetween: 40,
        speed: 10000,
        autoplay: false,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        }
      });
    } catch (e) {
      console.log(e, informationsCarousel);
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  let informationsCarousels = document.querySelectorAll(".informations-carousel");

  if (informationsCarousels) {
    initInformationsCarousels(informationsCarousels);
  }
})