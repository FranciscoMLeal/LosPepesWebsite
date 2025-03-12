let currentImageIndex = 0;
let projectImages = [];

function initializePage() {
    // Check if we're on the portfolio page
    if (document.getElementById('portfolioGrid')) {
        console.log('Loading portfolio page');
        loadPortfolio();
        return;
    }

    // Check if we're on the project page
    if (document.getElementById('projectTitle')) {
        console.log('Loading project page');
        loadProject();
        return;
    }
}

function loadPortfolio() {
    if (typeof projectsData === 'undefined') {
        console.error('projectsData is not defined!');
        return;
    }

    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) {
        console.error('Portfolio grid element not found');
        return;
    }

    portfolioGrid.innerHTML = '';

    Object.entries(projectsData).forEach(([id, project]) => {
        // Create project container
        const projectContainer = document.createElement('div');
        projectContainer.className = 'project-container';
        
        // Create project link
        const projectLink = document.createElement('a');
        projectLink.href = `/projectpage.html?id=${id}`;
        projectLink.className = 'project-link';

        // Create image
        const img = document.createElement('img');
        img.src = project.images[0];
        img.alt = `${project.title} - ${project.location} ${project.year}`;
        img.loading = "lazy";
        
        // Create overlay div
        const overlay = document.createElement('div');
        overlay.className = 'project-overlay';
        overlay.style.backgroundColor = '#405FFF80'; // Fixed color #405FFF at 50% opacity

        // Create project info div
        const projectInfo = document.createElement('div');
        projectInfo.className = 'project-info';
        projectInfo.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.location} • ${project.year}</p>
        `;
        
        // Assemble the components
        overlay.appendChild(projectInfo);
        projectLink.appendChild(img);
        projectLink.appendChild(overlay);
        projectContainer.appendChild(projectLink);
        portfolioGrid.appendChild(projectContainer);

        // Add SEO and accessibility improvements
        img.loading = "lazy"; // Lazy loading for better performance
        img.alt = `${project.title} - ${project.location} ${project.year}`; // More descriptive alt text
        
        // Add aria labels for accessibility
        projectLink.setAttribute('aria-label', `View project: ${project.title} in ${project.location}`);
        
        // Add touch feedback handlers
        projectLink.addEventListener('touchstart', handleTouchStart, { passive: true });
        projectLink.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
}

function loadProject() {
    // First, verify projectsData is available
    if (typeof projectsData === 'undefined') {
        console.error('projectsData is not defined! Check if projects.js is loaded correctly');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    console.log('Current URL parameters:', window.location.search);
    console.log('Trying to load project with ID:', projectId);

    if (!projectId || !projectsData[projectId]) {
        console.error('Project not found:', projectId);
        return;
    }

    const project = projectsData[projectId];
    projectImages = project.images;
    
    try {
        const titleElement = document.getElementById('projectTitle');
        const clientElement = document.getElementById('clientName');
        const descriptionElement = document.getElementById('projectDescription');
        const galleryGrid = document.getElementById('galleryGrid');
        const heroImage = document.getElementById('heroImage');
        const yearElement = document.getElementById('year');
        const locationElement = document.getElementById('location');

        if (!titleElement || !clientElement || !descriptionElement || !galleryGrid || !heroImage) {
            console.error('Required elements not found');
            return;
        }

        // Update content
        titleElement.textContent = project.title;
        clientElement.textContent = project.client;
        descriptionElement.textContent = project.description;
        yearElement.textContent = project.year;
        locationElement.textContent = project.location;

        // Set hero image
        if (project.images && project.images.length > 0) {
            heroImage.src = project.images[0];
            heroImage.alt = `${project.title} Hero Image`;
            heroImage.onclick = (e) => expandImage(e.target);
        }

        // Apply theme colors
        applyProjectTheme(project.colors);
        
        // Populate gallery
        galleryGrid.innerHTML = '';
        
        // Add all images except the first one
        project.images.slice(1).forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `${project.title} - Image ${index + 1}`;
            img.className = 'gallery-image';
            img.onclick = (e) => expandImage(e.target);
            galleryGrid.appendChild(img);
        });

        // Add the first image at the end of the gallery
        if (project.images.length > 0) {
            const heroInGallery = document.createElement('img');
            heroInGallery.src = project.images[0];
            heroInGallery.alt = `${project.title} - Hero Image`;
            heroInGallery.className = 'gallery-image';
            heroInGallery.onclick = (e) => expandImage(e.target);
            galleryGrid.appendChild(heroInGallery);
        }

    } catch (error) {
        console.error('Error updating page content:', error);
    }
}

function expandImage(clickedImg) {
    const expandedImg = document.querySelector('.image-expanded');
    const overlay = document.querySelector('.overlay');
    
    // Find the index of clicked image
    currentImageIndex = Array.from(document.querySelectorAll('.gallery-image'))
        .findIndex(img => img.src === clickedImg.src);
    
    expandedImg.src = clickedImg.src;
    overlay.classList.add('active');
    expandedImg.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showNextImage() {
    const expandedImg = document.querySelector('.image-expanded');
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    expandedImg.src = projectImages[currentImageIndex];
}

function showPrevImage() {
    const expandedImg = document.querySelector('.image-expanded');
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    expandedImg.src = projectImages[currentImageIndex];
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    // Add overlay, expanded image, and navigation arrows
    document.body.insertAdjacentHTML('beforeend', `
        <div class="overlay"></div>
        <img class="image-expanded" src="" alt="Expanded image">
        <button class="nav-arrow prev-arrow">&#10094;</button>
        <button class="nav-arrow next-arrow">&#10095;</button>
    `);

    // Get elements after they're added to the DOM
    const overlay = document.querySelector('.overlay');
    const expandedImg = document.querySelector('.image-expanded');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    // Hide arrows initially
    prevArrow.style.display = 'none';
    nextArrow.style.display = 'none';

    // Add click event to overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {  // Only close if clicking the overlay itself
            overlay.classList.remove('active');
            expandedImg.classList.remove('active');
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Add navigation events
    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent overlay from closing
        showPrevImage();
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent overlay from closing
        showNextImage();
    });

    // Show/hide arrows when image is expanded/closed
    expandedImg.addEventListener('load', () => {
        if (expandedImg.classList.contains('active')) {
            prevArrow.style.display = 'block';
            nextArrow.style.display = 'block';
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (overlay.classList.contains('active')) {
            switch(e.key) {
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'Escape':
                    overlay.classList.remove('active');
                    expandedImg.classList.remove('active');
                    prevArrow.style.display = 'none';
                    nextArrow.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    break;
            }
        }
    });

    // Set up event listeners
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');
    const nextBtn = document.querySelector('.next-button');
    const prevBtn = document.querySelector('.prev-button');

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        };
    }

    if (nextBtn) {
        nextBtn.onclick = nextImage;
    }

    if (prevBtn) {
        prevBtn.onclick = previousImage;
    }

    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            }
        };

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        modal.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === "block") {
            switch(e.key) {
                case "ArrowLeft":
                    previousImage();
                    break;
                case "ArrowRight":
                    nextImage();
                    break;
                case "Escape":
                    modal.style.display = "none";
                    document.body.style.overflow = 'auto';
                    break;
            }
        }
    });

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
            navbar.classList.add('hide-navbar');
        } else {
            navbar.classList.remove('hide-navbar');
        }

        // Update last scroll position
        lastScrollPosition = currentScrollPosition;

        // Check if at top of page
        if (currentScrollPosition === 0) {
            navbar.classList.remove('hide-navbar');
        }
    });

    // WorkWithUsButton code - Only run if the button exists
    const button = document.querySelector('.WorkWithUsButton');
    if (button) {
        const initialPosition = button.offsetTop;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY >= initialPosition) {
                button.style.top = 0;
                button.style.position = 'fixed';
            } else {
                button.style.position = 'absolute';
                button.style.top = initialPosition + 'px';
            }
        });

        button.addEventListener('click', function() {
            navbar.classList.toggle('expanded');
            document.body.style.overflow = navbar.classList.contains('expanded') ? 'hidden' : '';
        });
    }

    // Navbar toggle functionality
    navbarToggle.addEventListener('click', function() {
        navbar.classList.toggle('expanded');
        document.body.style.overflow = navbar.classList.contains('expanded') ? 'hidden' : '';
    });

    // Collapse event listeners
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

    // Contact form functionality
    const showFormBtn = document.getElementById('showFormBtn');
    const contactForm = document.querySelector('.contact-form');

    if (showFormBtn && contactForm) {
        showFormBtn.addEventListener('click', function() {
            contactForm.classList.toggle('hidden-form');
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
        const img = container.querySelector('img');
        const txt = container.querySelector('.txt-index');
        
        if (img) {
            sr.reveal(img, {
                origin: 'bottom',
                distance: '50px',
                opacity: 0,
                interval: 300
            });
        }
        
        if (txt) {
            sr.reveal(txt, {
                origin: 'bottom',
                distance: '50px',
                opacity: 0,
                interval: 300,
                delay: 300
            });
        }
    });

    // Scroll reveal animation for gallery
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Add event listener for scroll
    window.addEventListener('scroll', reveal);
    
    // Call reveal on initial load
    reveal();

    // Gallery image click handlers
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Add your image click behavior here if desired
        });
    });

    // Add intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all project containers
    document.querySelectorAll('.project-container').forEach(container => {
        observer.observe(container);
    });

    initParallax();
    initStickyScroll();
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initStickyScroll();
        }, 250);
    });

    // Get all links that should scroll to contact form
    const contactLinks = document.querySelectorAll('a[href*="#contact-section"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to the contact section
            document.querySelector('#contact-section').scrollIntoView({
                behavior: 'smooth'
            });

            // After scrolling, trigger the showFormBtn click
            setTimeout(() => {
                document.querySelector('#showFormBtn').click();
            }, 800); // Wait for scroll to complete
        });
    });
});

function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    updateModalImage();
    modal.style.display = "block";
    updateImageCounter();
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = projectImages[currentImageIndex];
}

function updateImageCounter() {
    document.getElementById('currentImageIndex').textContent = currentImageIndex + 1;
    document.getElementById('totalImages').textContent = projectImages.length;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    updateModalImage();
    updateImageCounter();
}

function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    updateModalImage();
    updateImageCounter();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextImage(); // Swipe left
        } else {
            previousImage(); // Swipe right
        }
    }
}

function applyProjectTheme(colors) {
    // Apply colors to sections including hero section
    const topBar = document.querySelector('.top-bar-section');
    const titleSection = document.querySelector('.title-section');
    const heroSection = document.querySelector('.hero-section');
    const descriptionSection = document.querySelector('.description-section');
    const gallery = document.querySelector('.gallery');
    const contactContainer = document.querySelector('.contact-container');

    if (topBar) topBar.style.backgroundColor = colors.topBar;
    if (titleSection) titleSection.style.backgroundColor = colors.titleSection;
    if (heroSection) heroSection.style.backgroundColor = colors.titleSection; // Using title section color
    if (descriptionSection) descriptionSection.style.backgroundColor = colors.description;
    if (gallery) gallery.style.backgroundColor = colors.gallery;
    if (contactContainer) contactContainer.style.backgroundColor = colors.contactForm;
}

// Touch feedback handlers
function handleTouchStart(e) {
    const link = e.currentTarget;
    link.classList.add('touch-active');
}

function handleTouchEnd(e) {
    const link = e.currentTarget;
    link.classList.remove('touch-active');
}

function initParallax() {
    const parallaxImage = document.querySelector('.parallax');
    if (!parallaxImage) return;

    // Add loading="eager" to prioritize loading
    parallaxImage.loading = "eager";
    
    // Pre-calculate viewport height
    const viewportHeight = window.innerHeight;
    let lastScrollY = window.scrollY;
    let animationFrame;

    function updateParallax() {
        // Only update if the element is in viewport
        const rect = parallaxImage.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) {
            return;
        }

        const yOffset = window.scrollY;
        const speed = 0.3; // Reduced speed for smoother effect
        const translateY = yOffset * speed;
        
        // Use transform3d for better performance
        parallaxImage.style.transform = `translate3d(-50%, ${translateY}px, 0)`;
        lastScrollY = yOffset;
    }

    function onScroll() {
        if (animationFrame) {
            return;
        }
        
        animationFrame = requestAnimationFrame(() => {
            updateParallax();
            animationFrame = null;
        });
    }

    // Throttled scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            return;
        }
        
        scrollTimeout = setTimeout(() => {
            onScroll();
            scrollTimeout = null;
        }, 10); // 10ms throttle
    }, { passive: true });

    // Update on resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            viewportHeight = window.innerHeight;
            updateParallax();
        }, 250);
    }, { passive: true });

    // Initial update
    updateParallax();
}

function initStickyScroll() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;

    const projects = document.querySelectorAll('.project-container');
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Adjust these values to control when the effect triggers
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('out-of-view');
            } else {
                entry.target.classList.add('out-of-view');
            }
        });
    }, observerOptions);

    projects.forEach(project => {
        observer.observe(project);
    });
}

