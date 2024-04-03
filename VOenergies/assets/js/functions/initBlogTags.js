let initBlogTags = (blogTagsContainer) => {
   let iconWhenNotActive = blogTagsContainer.querySelector('.icon-container'),
       iconWhenActive =  blogTagsContainer.querySelector('.icon-container-active');
  
  blogTagsContainer.addEventListener('click', () => {  
    blogTagsContainer.classList.toggle('active')
    if (blogTagsContainer.classList.contains('active')) {
       iconWhenActive.classList.remove('d-none')
       iconWhenNotActive.classList.remove('d-flex')
       iconWhenActive.classList.add('d-flex')
       iconWhenNotActive.classList.add('d-none')
       handleTagsShow(blogTagsContainer, true)
    } else {
       iconWhenActive.classList.remove('d-flex')
       iconWhenNotActive.classList.remove('d-none')
       iconWhenActive.classList.add('d-none')
       iconWhenNotActive.classList.add('d-flex')
      handleTagsShow(blogTagsContainer, false)
    }
  })    
}

let handleTagsShow = (blogTagsContainer, openCloseTags) => {
   blogTagsContainer.querySelectorAll('.blog-tags__topic-container').forEach((link) => {
     if(openCloseTags){
        //OPEN
        if (!link.classList.contains('active')) {
            link.classList.add('active')
        }
      }else{
        //CLOSE
        if (link.classList.contains('active') && !link.dataset.showdefault) {
          link.classList.remove('active')
        }
      }
   })    
}