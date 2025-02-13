document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const navbarToggle = document.querySelector('.navbar-toggler');
  const brandItem = navbar.querySelector('.nav-brand');
  const collapse = navbar.querySelector('.navbar-collapse');

  // Set initial scroll position
  let lastScrollPosition = window.pageYOffset;

  // Add an event listener for when the user scrolls
  window.addEventListener('scroll', () => {
    // Get current scroll position
    const currentScrollPosition = window.pageYOffset;

    // Check if scrolling down
    if (currentScrollPosition > lastScrollPosition) {
      // Add hide-navbar class
      navbar.classList.add('hide-navbar');
    } else {
      // Remove hide-navbar class
      navbar.classList.remove('hide-navbar');
    }

    // Update last scroll position
    lastScrollPosition = currentScrollPosition;

    // Check if at top of page
    if (currentScrollPosition === 0) {
      // Remove hide-navbar class
      navbar.classList.remove('hide-navbar');
    }
  });

  navbarToggle.addEventListener('click', function() {
    navbar.classList.toggle('expanded');

    if (navbar.classList.contains('expanded')) {
      // Lock scroll when navbar is expanded
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll when navbar is not expanded
      document.body.style.overflow = '';
    }
  });

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

  // Get the button element
  const button = document.querySelector('.WorkWithUsButton');
  const initialPosition = button.offsetTop;

  // Set initial scroll position
  lastScrollPosition = window.pageYOffset;

  // Add an event listener for when the user scrolls
  window.addEventListener('scroll', () => {
    // Check if the button has reached the top of the page
    if (window.scrollY >= initialPosition) {
      // If it has, change its position property to fixed
      button.style.top = 0;
      button.style.position = 'fixed';
    } else {
      // If it hasn't, change its position property back to absolute
      button.style.position = 'absolute';
      button.style.top = initialPosition + 'px';
    }

    // Get current scroll position
    const currentScrollPosition = window.pageYOffset;

    // Check if scrolling down
    if (currentScrollPosition > lastScrollPosition) {
      // Add hide-navbar class
      navbar.classList.add('hide-navbar');
    } else {
      // Remove hide-navbar class
      navbar.classList.remove('hide-navbar');
    }

    // Update last scroll position
    lastScrollPosition = currentScrollPosition;
  });

  button.addEventListener('click', function() {
    navbar.classList.toggle('expanded');

    if (navbar.classList.contains('expanded')) {
      // Lock scroll when navbar is expanded
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll when navbar is not expanded
      document.body.style.overflow = '';
    }
  });

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

  const showFormBtn = document.getElementById('showFormBtn');
  const contactForm = document.querySelector('.contact-form');

  if (showFormBtn && contactForm) {
    showFormBtn.addEventListener('click', function() {
      contactForm.classList.remove('hidden-form');
      showFormBtn.style.display = 'none';
    });
  }

  // Initialize ScrollReveal
  const sr = ScrollReveal({
    duration: 1000,
    delay: 200,
    reset: false
  });

  // Select all containers EXCEPT the contact container
  const contentContainers = document.querySelectorAll('.container2:not(.contact-container)');

  // Apply animations to each container
  contentContainers.forEach((container) => {
    // Reveal images from bottom
    sr.reveal(container.querySelector('img'), {
      origin: 'bottom',
      distance: '50px',
      opacity: 0,
      interval: 300
    });
    
    // Reveal text from bottom with a slight delay
    sr.reveal(container.querySelector('.txt-index'), {
      origin: 'bottom',
      distance: '50px',
      opacity: 0,
      interval: 300,
      delay: 300 // Additional delay for text to create a sequence effect
    });
  });
});