let initAccordions = (accordions) => {
  accordions.forEach(accordion => {
    let accordionToggles = accordion.querySelectorAll(".accordion-title");

    accordionToggles.forEach(accordionToggle => {
      initActiveOrNot(accordionToggle)
      accordionToggle.addEventListener('click', () => {       
        accordionToggle.parentNode.classList.toggle('active');
        initActiveOrNot(accordionToggle)
      })
    })
  })
}

let initActiveOrNot = (accordionToggle) => {
   let iconWhenNotActive = accordionToggle.querySelector('.icon-container'),
       iconWhenActive =  accordionToggle.querySelector('.icon-container-active');
  
    if (accordionToggle.parentNode.classList.contains('active')) {
       iconWhenActive.classList.remove('d-none')
       iconWhenNotActive.classList.remove('d-flex')
       iconWhenActive.classList.add('d-flex')
       iconWhenNotActive.classList.add('d-none')
    } else {
       iconWhenActive.classList.remove('d-flex')
       iconWhenNotActive.classList.remove('d-none')
       iconWhenActive.classList.add('d-none')
       iconWhenNotActive.classList.add('d-flex') 
    }
}