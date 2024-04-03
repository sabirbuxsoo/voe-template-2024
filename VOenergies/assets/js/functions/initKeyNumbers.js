let initKeyNumbers = (keyNumbersContainers) => {
  keyNumbersContainers.forEach(keyNumberContainer => {
    let keyNumbers = keyNumberContainer.querySelectorAll('.key-number__number')
    keyNumbers.forEach(keyNumber => {
      let start = 0,
          end = keyNumber.dataset.number,
          duration = keyNumber.dataset.duration,
          startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1),
              formatter = new Intl.NumberFormat('fr-FR');
        keyNumber.innerText = formatter.format(Math.floor(progress * (end - start) + start));
        if (progress < 1) { window.requestAnimationFrame(step); }
      };
      window.requestAnimationFrame(step);
    })
  })
};