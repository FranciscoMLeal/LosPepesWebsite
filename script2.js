document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const navbarToggle = navbar?.querySelector('.navbar-toggler');
  const brandItem = navbar?.querySelector('.nav-brand');
  const collapse = navbar?.querySelector('.navbar-collapse');

  // Set initial scroll position
  let lastScrollPosition = window.pageYOffset;

  // Add an event listener for when the user scrolls
  window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    if (navbar) {
      if (currentScrollPosition > lastScrollPosition) {
        navbar.classList.add('hide-navbar');
      } else {
        navbar.classList.remove('hide-navbar');
      }
      if (currentScrollPosition === 0) {
        navbar.classList.remove('hide-navbar');
      }
    }
    lastScrollPosition = currentScrollPosition;
  });

  if (navbarToggle) {
    navbarToggle.addEventListener('click', function() {
      navbar.classList.toggle('expanded');
      document.body.style.overflow = navbar.classList.contains('expanded') ? 'hidden' : '';
    });
  }

  if (collapse) {
    collapse.addEventListener('show.bs.collapse', function() {
      if (navbar.classList.contains('expanded')) {
        brandItem.classList.add('hidden-brand');
      }
    });
    collapse.addEventListener('hide.bs.collapse', function() {
      if (!navbar.classList.contains('expanded')) {
        brandItem.classList.remove('hidden-brand');
      }
    });
  }

  // --- PROJECT DESCRIPTION HTML SUPPORT ---
  // Try to find and render project description with HTML
  const descriptionElement = document.getElementById('projectDescription');
  if (descriptionElement && window.projectsData) {
    // Try to get project id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    if (projectId && window.projectsData[projectId]) {
      descriptionElement.innerHTML = window.projectsData[projectId].description;
    }
  }
});