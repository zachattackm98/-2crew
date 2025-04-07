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

// Improved Calendly widget implementation
document.addEventListener('DOMContentLoaded', function() {
    // Global flag for initialization status
    window.calendlyInitialized = false;
    
    // First, add this style to ensure the container has proper height
    const style = document.createElement('style');
    style.textContent = `
        #calendly-widget {
            min-height: 700px;
            width: 100%;
            transition: opacity 0.3s ease;
        }
        .calendly-inline-widget {
            min-height: 700px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    
    // Set up the onload handler BEFORE appending to DOM
    script.onload = function() {
        console.log("✅ Calendly script loaded successfully");
        
        // If user is already on step 4, initialize the widget
        if (document.querySelector('.form-step[data-step="4"].active')) {
            initCalendlyWidget();
        }
    };
    
    // Set up error handler
    script.onerror = function() {
        console.error("❌ Failed to load Calendly script");
        const widget = document.getElementById('calendly-widget');
        if (widget) {
            widget.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Unable to load calendar. Please check your internet connection and refresh the page.</div>';
        }
    };
    
    // Now append the script to the DOM
    document.head.appendChild(script);
    
    // Function to initialize Calendly widget
    function initCalendlyWidget() {
        const container = document.getElementById('calendly-widget');
        if (!container) {
            console.error("Cannot find calendly-widget container");
            return;
        }
        
        // Show loading indicator
        container.innerHTML = '<div style="text-align: center; padding: 20px;">Loading calendar...</div>';
        
        // Get form data
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        
        console.log("Form data for Calendly:", { name, email, phone });
        
        // Basic check if Calendly is loaded
        if (typeof Calendly === 'undefined') {
            console.error("Calendly is not defined");
            setTimeout(function() {
                // Try again in a second
                if (typeof Calendly === 'undefined') {
                    container.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Calendar failed to load. Please refresh the page.</div>';
                } else {
                    initCalendlyWidget(); // Try again
                }
            }, 1000);
            return;
        }
        
        // Clear container and initialize widget
        try {
            container.innerHTML = '';
            
            // Initialize the widget with explicit height
            Calendly.initInlineWidget({
                url: 'https://calendly.com/zachm98/30min',
                parentElement: container,
                prefill: {
                    name: name,
                    email: email,
                    customAnswers: {
                        a1: phone
                    }
                }
            });
            
            window.calendlyInitialized = true;
            console.log("✅ Calendly widget initialized successfully");
        } catch (error) {
            console.error("Calendly initialization error:", error);
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Error loading calendar. Please refresh the page.</div>';
        }
    }
    
    // Modify the nextStep function to properly initialize Calendly
    const originalNextStep = window.nextStep;
    window.nextStep = function() {
        // Get current step before calling the original function
        const currentStepElement = document.querySelector('.form-step.active');
        const currentStep = currentStepElement ? parseInt(currentStepElement.getAttribute('data-step')) : 0;
        
        // Call the original function
        if (typeof originalNextStep === 'function') {
            originalNextStep();
        }
        
        // If we're moving from step 3 to step 4, initialize Calendly
        if (currentStep === 3) {
            // Wait a bit for the DOM to update
            setTimeout(function() {
                // Check if Calendly script is loaded
                if (typeof Calendly !== 'undefined' && !window.calendlyInitialized) {
                    initCalendlyWidget();
                } else if (typeof Calendly === 'undefined') {
                    const widget = document.getElementById('calendly-widget');
                    if (widget) {
                        widget.innerHTML = '<div style="text-align: center; padding: 20px;">Loading calendar...</div>';
                    }
                    
                    // Set an interval to check if Calendly is loaded
                    const checkInterval = setInterval(function() {
                        if (typeof Calendly !== 'undefined') {
                            clearInterval(checkInterval);
                            initCalendlyWidget();
                        }
                    }, 500);
                }
            }, 100);
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
                    console.log("✅ Time slot selected:", e.data.payload);
                }
            }
        }
    });
});
