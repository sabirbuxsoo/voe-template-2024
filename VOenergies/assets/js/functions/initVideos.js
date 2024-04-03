let handleVideos = (entries, videosObserver) => {
  entries.map(video => {
    if (video.isIntersecting) {
      for (var source in video.target.children) {
        var videoSource = video.target.children[source];

        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
          videoSource.src = videoSource.dataset.src;
        }
      }

      if(video.target.dataset.src) {
        video.target.src = video.target.dataset.src;
      }

      if(video.target.tagName === "video") {
        video.target.load();
      }

      video.target.classList.add("loaded");
      videosObserver.unobserve(video.target);
    }
  });
}

let initVideos = (videos) => {
  let videosObserver = new IntersectionObserver(handleVideos, { 'rootMargin': '0% 0% 50% 0%' });

  videos.forEach(video => {
    videosObserver.observe(video, videosObserver);
  });
}