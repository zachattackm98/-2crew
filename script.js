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

// Simplified Calendly Integration Based on Your Working Code
// Replace your current Calendly implementation with this code in script.js
// (Keep all other code in script.js the same)

// Calendly Integration - Fixed Version
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, setting up Calendly...");
    
    // Add necessary CSS
    const style = document.createElement('style');
    style.textContent = `
        #calendly-widget {
            min-height: 700px;
        }
        .calendly-inline-widget {
            min-height: 700px !important;
            height: 700px !important;
        }
        .loading-indicator {
            text-align: center;
            padding: 20px;
        }
        .error-message {
            text-align: center;
            padding: 20px;
            color: red;
        }
    `;
    document.head.appendChild(style);
    
    // Load Calendly script
    const calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;
    calendlyScript.defer = true; // Add defer attribute for better loading
    document.head.appendChild(calendlyScript);
    
    // Track loading state
    let calendlyLoaded = false;
    
    calendlyScript.onload = () => {
        console.log("Calendly script loaded successfully");
        calendlyLoaded = true;
        
        // Check if we're already on step 4
        if (document.querySelector('.form-step[data-step="4"].active')) {
            console.log("Already on step 4, initializing widget immediately");
            initCalendlyWidget();
        }
    };
    
    calendlyScript.onerror = () => {
        console.error("Failed to load Calendly script");
        const widget = document.getElementById('calendly-widget');
        if (widget) {
            widget.innerHTML = '<div class="error-message">Failed to load calendar service. Please try again later.</div>';
        }
    };
    
    // Initialize the Calendly widget
    function initCalendlyWidget() {
        console.log("Initializing Calendly widget");
        
        // Get the widget container
        const calendlyWidget = document.getElementById('calendly-widget');
        if (!calendlyWidget) {
            console.error("Cannot find calendly-widget element");
            return;
        }
        
        // Show loading indicator
        calendlyWidget.innerHTML = '<div class="loading-indicator">Loading calendar...</div>';
        
        // Get form data
        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        
        console.log("Form data:", { name, email, phone });
        
        // Check if all required fields are filled
        if (!name || !email || !phone) {
            console.warn("Missing required fields");
            calendlyWidget.innerHTML = '<div class="error-message">Please complete the contact information in step 1.</div>';
            return;
        }
        
        // Check if Calendly is loaded
        if (typeof Calendly !== 'undefined') {
            try {
                console.log("Calendly is defined, initializing widget");
                
                // Clear the container
                calendlyWidget.innerHTML = '';
                
                // Initialize the widget - simplified approach
                Calendly.initInlineWidget({
                    url: 'https://calendly.com/zachm98/30min?hide_gdpr_banner=1&name=' + 
                         encodeURIComponent(name) + '&email=' + 
                         encodeURIComponent(email) + '&a1=' + 
                         encodeURIComponent(phone),
                    parentElement: calendlyWidget
                });
                
                console.log("Widget initialized successfully");
            } catch (error) {
                console.error("Error initializing Calendly widget:", error);
                calendlyWidget.innerHTML = '<div class="error-message">Failed to load calendar. Please try again.</div>';
            }
        } else {
            // If Calendly isn't loaded yet, wait and try again
            console.log("Calendly not loaded yet, will retry...");
            calendlyWidget.innerHTML = '<div class="loading-indicator">Loading calendar service...</div>';
            setTimeout(initCalendlyWidget, 500);
        }
    }
    
    // Listen for Calendly events
    window.addEventListener('message', function(event) {
        // Security check
        if (event.origin.indexOf('calendly.com') === -1) return;
        
        console.log("Received event from Calendly:", event.data.event);
        
        if (event.data.event === 'calendly.date_and_time_selected') {
            // Store selected time details
            const selectedTimeDetails = event.data.payload;
            const detailsInput = document.getElementById('selectedAppointmentDetails');
            if (detailsInput) {
                detailsInput.value = JSON.stringify(selectedTimeDetails);
                console.log('Time slot selected:', selectedTimeDetails);
            }
        }
    });
    
    // Store original nextStep function
    const origNextStep = window.nextStep;
    
    // Override nextStep to handle Calendly initialization on step 4
    window.nextStep = function() {
        // Get current step
        const currentStep = parseInt(document.querySelector('.form-step.active').getAttribute('data-step'));
        console.log("nextStep called, current step:", currentStep);
        
        // Special handling for transition to step 4
        if (currentStep === 3) {
            // First call original nextStep to make the step visible
            if (typeof origNextStep === 'function') {
                origNextStep();
            } else {
                // Fallback navigation if original function is not available
                document.querySelector('.form-step.active').classList.remove('active');
                document.querySelector('.form-step[data-step="4"]').classList.add('active');
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            
            // Initialize Calendly
            if (calendlyLoaded) {
                console.log("Calendly already loaded, initializing widget");
                initCalendlyWidget();
            } else {
                console.log("Calendly not loaded yet, showing loading message");
                const widget = document.getElementById('calendly-widget');
                if (widget) {
                    widget.innerHTML = '<div class="loading-indicator">Loading calendar...</div>';
                }
                
                // Check periodically if Calendly has loaded
                const checkInterval = setInterval(() => {
                    if (calendlyLoaded) {
                        console.log("Calendly loaded during interval check");
                        clearInterval(checkInterval);
                        initCalendlyWidget();
                    }
                }, 200);
            }
            
            return; // Exit to prevent calling original nextStep twice
        }
        
        // For all other steps, use original function
        if (typeof origNextStep === 'function') {
            origNextStep();
        }
    };
    
    // Call the original updateSummary function when reaching the review step
    const origUpdateSummary = window.updateSummary;
    if (typeof origUpdateSummary === 'function') {
        // Store the original nextStep again
        const originalNextStep = window.nextStep; 
        
        // Add summary update logic
        window.nextStep = function() {
            // Get current step before changing it
            const currentStep = parseInt(document.querySelector('.form-step.active').getAttribute('data-step'));
            
            // Call our modified nextStep function
            originalNextStep();
            
            // If we just moved to step 7 (review), update the summary
            if (currentStep === 6) {
                origUpdateSummary();
            }
        };
    }
});
