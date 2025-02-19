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
    // First, verify projectsData is available
    if (typeof projectsData === 'undefined') {
        console.error('projectsData is not defined! Check if projects.js is loaded correctly');
        return;
    }

    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) {
        console.error('Portfolio grid element not found');
        return;
    }

    // Clear existing content
    portfolioGrid.innerHTML = '';

    console.log('Loading projects:', Object.keys(projectsData));

    // Loop through all projects
    Object.entries(projectsData).forEach(([id, project]) => {
        console.log('Creating element for project:', id);
        
        // Create project link
        const projectLink = document.createElement('a');
        projectLink.href = `/projectpage.html?id=${id}`;
        projectLink.className = 'project-link';

        // Create and set up image
        const img = document.createElement('img');
        img.src = project.images[0]; // Use first image as thumbnail
        img.alt = project.title;
        
        // Add image to link
        projectLink.appendChild(img);
        
        // Add link to grid
        portfolioGrid.appendChild(projectLink);
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