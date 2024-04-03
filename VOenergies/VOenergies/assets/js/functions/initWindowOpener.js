let initWindowOpener = (windowOpener) => {
  windowOpener.addEventListener('click', () => {
    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
        height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
        left = (width - 600) / 2,
        top = (height - 600) / 2,
        newWindow = window.open(windowOpener.dataset.url, 'window-opener', `scrollbars=yes, width=${600}, height=${600}, top=${top}, left=${left}`);

    if (window.focus) { 
      newWindow.focus();
    }
  })
}