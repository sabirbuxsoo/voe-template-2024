let getScrollPosition = (scrollElement, elementHeight, elementTopPosition, windowHeight, delta = 1) => {
  if (scrollElement.getAttribute("delta")) {
    delta = parseFloat(scrollElement.getAttribute("delta"));
  }

  let currentScroll = window.scrollY + (windowHeight * delta),
      scrollTop = (currentScroll - elementTopPosition);

  scrollElement.dataset.scrollTop = scrollTop;
  scrollElement.dataset.percentage = scrollTop / elementHeight;
  scrollElement.dataset.elementHeight = elementHeight;
  scrollElement.dataset.elementTopPosition = elementTopPosition;

  return scrollTop / elementHeight;
}

let extractStringFromHTML = (string) => {
  let span = document.createElement('span');
  span.innerHTML = string;
  return span.textContent || span.innerText;
};

let handleAnimeElements = (entry, options, AnimeElementsObserver) => {
  if (entry.isIntersecting) {
    entry.target.anime(options).play();
    AnimeElementsObserver.unobserve(entry.target);
  }
}

let setAnimationHTML = (animation, isAnimationBackground) => {
  return new Promise((resolve, reject) => {
    if (isAnimationBackground && animation.getAttribute("data-image")) {
      let http = new XMLHttpRequest();

      http.open("GET", animation.getAttribute("data-image"));
      http.send();

      http.onreadystatechange = function() {
        if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
          animation.querySelector(".background-elements__inner").innerHTML = http.responseText;
          animation.querySelector("svg").viewBox = `0 0 ${ animation.querySelector("svg").width } ${ animation.querySelector("svg").height }`
          resolve(true);
        }
      };
    } else {
      resolve(true);
    }
  })
}

let triggerAnimation = (animation, options, isAnimationBackground, bindToScroll) => {
  animation.closest(".dnd-section").classList.add("o-hidden");

  if (window.innerWidth > 600) {
    const AnimeElement = anime(options);

    if (bindToScroll) {
      let animationFrame = 0,
          elementHeight = isAnimationBackground ? animation.closest(".dnd-section").offsetHeight : animation.offsetHeight,
          elementTopPosition = isAnimationBackground ? animation.closest(".dnd-section").offsetTop : animation.offsetTop,
          windowHeight = window.outerHeight;
      
      setTimeout(()=> {      
        let animationFrame = getScrollPosition(animation, elementHeight, elementTopPosition, windowHeight);

        AnimeElement.pause(AnimeElement.duration * animationFrame);
        AnimeElement.seek(AnimeElement.duration * animationFrame);
      }, AnimeElement.duration * animationFrame)

      window.addEventListener("scroll", () => { 
        animationFrame = getScrollPosition(animation, elementHeight, elementTopPosition, windowHeight);
        AnimeElement.seek(AnimeElement.duration * animationFrame);
      });

      window.addEventListener("resize", () => {         
        let elementHeight = animation.offsetHeight,
            elementTopPosition = animation.offsetTop,
            windowHeight = window.outerHeight;

        animationFrame = getScrollPosition(animation, elementHeight, elementTopPosition, windowHeight);
        AnimeElement.seek(AnimeElement.duration * animationFrame);
      });
    } else {
      let AnimeElementsObserver = new IntersectionObserver(handleLazyElements, { 'rootMargin': '0% 0% 50% 0%' });
      AnimeElementsObserver.observe(animation, options, AnimeElementsObserver);
    }
  }
}

let initAnimations = (animations) => {
  animations.forEach(animation => {
    const bindToScroll = animation.getAttribute("bind") === 'true';
    const triggerByCharacter = animation.getAttribute("divide") === 'true';
    const isAnimationBackground = animation.classList.contains('animation--background');
    let options = { targets: [animation] }

    for(const [key, value] of Object.entries(animation.dataset)) {
      switch (true) {
        case (value === 'true' || value === 'false'):
          options[key] = value === 'true';
          break;
        case (value.indexOf(",") > -1 && Array.isArray(eval(value))):
          options[key] = JSON.parse(value);
          break;
        case (!Number.isNaN(parseInt(value))):
          options[key] = parseInt(value);
          break;
        default:
          options[key] = value;
      }
    }

    setAnimationHTML(animation, isAnimationBackground).then(() => {
      if (isAnimationBackground) {
        animation.closest(".dnd-section").classList.add("p-relative", "z-xs");
        animation.closest(".row-fluid-wrapper").classList.add("dnd-row--background", "z-n");

        if (triggerByCharacter) {
          options.targets = document.querySelectorAll(`#${ animation.id } svg path`);
          options.delay = anime.stagger(200, { grid: [10, 5], from: 'center' });
        }

        triggerAnimation(animation, options, isAnimationBackground, bindToScroll);
      } 

      if (!isAnimationBackground) {
        if (triggerByCharacter) {
          let htmlElements = animation.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre");

          htmlElements.forEach(htmlElement => {
            let words = htmlElement.innerHTML.replaceAll("<br>", " ").split(" ")
            htmlElement.innerHTML = "";

            words.forEach((word, index) => {
              let tempWord = word.replaceAll(extractStringFromHTML(word), "temp")
              let htmlWord = document.createElement("span");
              let characters = extractStringFromHTML(word).split("")

              characters.forEach((character, index) => {
                let htmlCharacter = document.createElement("span");
                htmlCharacter.dataset.index = index;
                htmlCharacter.classList = character != " " ? "d-inline-block" : "";
                htmlCharacter.innerHTML = character;
                htmlWord.appendChild(htmlCharacter);
              })

              htmlElement.innerHTML += `<span class="animation__word">${ tempWord.replaceAll("temp", htmlWord.innerHTML) }</span>`;

              if (index < words.length - 1) {
                let spacing = document.createElement("span");
                spacing.innerHTML = " ";
                htmlElement.appendChild(spacing);
              }
            })

            options.targets.push(`#${ animation.id } ${ htmlElement.tagName.toLowerCase() } .animation__word span`);

            options.delay = (elements, index) => { 
              return index * animation.dataset.delay;
            }
          })
        }

        triggerAnimation(animation, options, isAnimationBackground, bindToScroll);
      }
    })
  })
}