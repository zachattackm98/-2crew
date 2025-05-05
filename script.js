// Mobile Navigation Functionality
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Stat item hover effect
const statItems = document.querySelectorAll('.stat-item');

statItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.classList.add('pulse');
    });
    
    item.addEventListener('mouseleave', () => {
        item.classList.remove('pulse');
    });
});

// Improved testimonial auto-scroll
const testimonialContainer = document.querySelector('.testimonial-container');
if (testimonialContainer) {
    let scrollAmount = 0;
    let scrollMax = 0;
    let scrollInterval;
    let scrollDirection = 1; // 1 for forward, -1 for backward
    let scrollSpeed = 0.5; // pixels per tick (slower for smoother scrolling)

    // Calculate the maximum scroll value
    function updateScrollMax() {
        scrollMax = testimonialContainer.scrollWidth - testimonialContainer.clientWidth;
    }

    function startAutoScroll() {
        // Update scroll max first
        updateScrollMax();
        
        // Clear any existing interval
        if (scrollInterval) clearInterval(scrollInterval);
        
        scrollInterval = setInterval(() => {
            // Update scroll position
            scrollAmount += (scrollSpeed * scrollDirection);
            
            // Handle direction change for smooth scrolling
            if (scrollAmount >= scrollMax) {
                scrollDirection = -1; // start scrolling backward
            } else if (scrollAmount <= 0) {
                scrollDirection = 1; // start scrolling forward
            }
            
            // Apply the scroll position
            testimonialContainer.scrollLeft = scrollAmount;
        }, 20);
    }

    function stopAutoScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    // Handle window resize to update scroll parameters
    window.addEventListener('resize', updateScrollMax);
    
    // Initialize auto-scroll after page load
    setTimeout(startAutoScroll, 3000);
    
    // Pause on hover
    testimonialContainer.addEventListener('mouseenter', stopAutoScroll);
    testimonialContainer.addEventListener('mouseleave', startAutoScroll);
}

// Add this to your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Select all accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Add click event listener to each header
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on the closest accordion item
            const accordionItem = this.closest('.accordion-item');
            accordionItem.classList.toggle('active');
            
            // Optional: Close other accordion items when one is opened
            const allAccordionItems = document.querySelectorAll('.accordion-item');
            allAccordionItems.forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
        });
    });
});

// Enhanced Date Picker for Booking System
document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('date');
    
    // Exit early if there's no date picker on this page
    if (!datePicker) return;
    
    // Function to get today's date in YYYY-MM-DD format
    function getTodayFormatted() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // Set up the date picker
    function setupDatePicker() {
        // Set the minimum date to today
        datePicker.min = getTodayFormatted();

        // Add event listener to validate date selection
        datePicker.addEventListener('change', validateDateSelection);
    }

    // Initial setup
    setupDatePicker();
});

// Restore the missing validateDateSelection function
function validateDateSelection(event) {
    // Prevent selecting past dates (should already be handled by min, but double-check)
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (selectedDate < today) {
        alert("Please select a valid date (today or later).");
        event.target.value = '';
        return;
    }

    // Example: Prevent weekends (optional, uncomment if needed)
    // const day = selectedDate.getDay();
    // if (day === 0 || day === 6) {
    //     alert("Please select a weekday for your service.");
    //     event.target.value = '';
    // }
}

// Highlight 'What Should You Expect?' title when in view
const expectSection = document.getElementById('features');
const expectTitle = expectSection ? expectSection.querySelector('.section-title') : null;

if (expectSection && expectTitle) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                expectTitle.classList.add('active-section');
            } else {
                expectTitle.classList.remove('active-section');
            }
        });
    }, { threshold: 0.3 });
    sectionObserver.observe(expectSection);
}

// Highlight 'How It Works' title when in view
const howSection = document.querySelector('.features.section');
const howTitle = howSection ? howSection.querySelector('.section-title') : null;

if (howSection && howTitle) {
    const howSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                howTitle.classList.add('active-section');
            } else {
                howTitle.classList.remove('active-section');
            }
        });
    }, { threshold: 0.3 });
    howSectionObserver.observe(howSection);
}
