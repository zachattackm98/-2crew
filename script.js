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

// Testimonial auto-scroll (optional)
const testimonialContainer = document.querySelector('.testimonial-container');
if (testimonialContainer) {
    let scrollAmount = 0;
    let scrollMax = testimonialContainer.scrollWidth - testimonialContainer.clientWidth;
    let scrollInterval;

    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            scrollAmount += 1;
            if (scrollAmount >= scrollMax) {
                scrollAmount = 0;
            }
            testimonialContainer.scrollLeft = scrollAmount;
        }, 30);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }

    // Start auto-scroll after page load, stop on hover
    setTimeout(startAutoScroll, 3000);
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
            // Toggle active class on the parent accordion item
            const accordionItem = this.parentElement;
            accordionItem.classList.toggle('active');
            
            // Optional: Close other accordion items when one is opened
            // Comment this section out if you want multiple items to be open at once
            const allAccordionItems = document.querySelectorAll('.accordion-item');
            allAccordionItems.forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
        });
    });
});

// Calendly Widget Integration - Basic Version (Calendar Display Only)
document.addEventListener('DOMContentLoaded', function() {
    // We'll use a flag to track if we've already initialized the widget
    let calendlyInitialized = false;
    
    // Original nextStep function reference
    const originalNextStep = window.nextStep;
    
    window.nextStep = function() {
        // Get current step before changing it
        const currentStep = parseInt(document.querySelector('.form-step.active').getAttribute('data-step'));
        
        // Call original function
        if (typeof originalNextStep === 'function') {
            originalNextStep();
        }
        
        // If we're now on step 4 and haven't initialized Calendly yet
        if (currentStep === 3 && !calendlyInitialized) {
            const calendlyContainer = document.getElementById('calendly-widget');
            if (calendlyContainer) {
                // Show loading message
                calendlyContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading calendar...</div>';
                calendlyContainer.style.minHeight = "600px"; // Ensure there's space for the widget
                
                // Get form data
                const name = document.getElementById('name').value || '';
                const email = document.getElementById('email').value || '';
                const phone = document.getElementById('phone').value || '';
                
                // Set a timeout to make sure the DOM has updated
                setTimeout(function() {
                    try {
                        // Direct Calendly inline widget initialization
                        calendlyContainer.innerHTML = '';
                        Calendly.initInlineWidget({
                            url: 'https://calendly.com/zachm98/30min',
                            parentElement: calendlyContainer,
                            prefill: {
                                name: name,
                                email: email,
                                customAnswers: {
                                    a1: phone
                                }
                            }
                        });
                        calendlyInitialized = true;
                        console.log("Calendly initialized successfully");
                    } catch (error) {
                        console.error("Failed to initialize Calendly:", error);
                        calendlyContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Error loading calendar. Please refresh the page.</div>';
                    }
                }, 500);
            }
        }
    };
    
    // Listen for Calendly events
    window.addEventListener('message', function(e) {
        if (e.data.event && e.data.event.indexOf('calendly') === 0) {
            console.log("Calendly event:", e.data.event);
            
            if (e.data.event === 'calendly.date_and_time_selected') {
                // Store the selected time
                const detailsInput = document.getElementById('selectedAppointmentDetails');
                if (detailsInput) {
                    detailsInput.value = JSON.stringify(e.data.payload);
                }
            }
        }
    });
});
