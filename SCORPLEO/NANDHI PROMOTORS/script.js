document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Initialize mobile menu toggle after header is loaded
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    document.querySelector('nav ul').classList.toggle('active');
                });
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
        
    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });

    // Initialize hero slider if it exists on the page
    initHeroSlider();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Hero slider functionality
function initHeroSlider() {
    const heroSlider = document.getElementById('heroSlider');
    if (!heroSlider) return; // Exit if slider doesn't exist on this page
    
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    // Set first slide as active initially
    slides[0].classList.add('active');
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide (or back to first if at the end)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new current slide
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// For property image hover effects (if you add properties section later)
function setupImageHoverEffects() {
    const propertyImages = document.querySelectorAll('.property-image');
    if (propertyImages.length > 0) {
        propertyImages.forEach(image => {
            image.addEventListener('mouseenter', function() {
                this.querySelector('img').style.transform = 'scale(1.1)';
            });
            
            image.addEventListener('mouseleave', function() {
                this.querySelector('img').style.transform = 'scale(1)';
            });
        });
    }
}

// Call this function after the content is loaded
window.addEventListener('load', setupImageHoverEffects);
































































