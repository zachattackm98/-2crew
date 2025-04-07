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
document.addEventListener('DOMContentLoaded', () => {
    // Load Calendly script dynamically
    const calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;
    document.head.appendChild(calendlyScript);

    // Track Calendly loading state
    let calendlyLoaded = false;
    calendlyScript.onload = () => {
        calendlyLoaded = true;
        // If user is already on step 4, initialize the widget immediately
        if (document.querySelector('.form-step[data-step="4"].active')) {
            initCalendlyWidget();
        }
    };

    function initCalendlyWidget() {
        // Add loading indicator
        const calendlyWidget = document.getElementById('calendly-widget');
        if (calendlyWidget) {
            calendlyWidget.innerHTML = '<div style="text-align: center; padding: 20px;">Loading calendar...</div>';
        }

        // Get contact information from previous steps
        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';

        // Construct Calendly URL with prefilled parameters
        const calendlyUrl = `https://calendly.com/zachm98/30min?` +
            `name=${encodeURIComponent(name)}` +
            `&email=${encodeURIComponent(email)}` +
            `&a1=${encodeURIComponent(phone)}`;

        // Initialize Calendly widget when script is loaded
        if (typeof Calendly !== 'undefined') {
            calendlyWidget.innerHTML = ''; // Clear loading indicator
            Calendly.initInlineWidget({
                url: calendlyUrl,
                parentElement: calendlyWidget,
                prefill: {
                    name: name,
                    email: email,
                    customAnswers: {
                        a1: phone
                    }
                },
                welcomeScreenOptions: {
                    showName: false,
                    showEmail: false
                }
            });
        } else {
            // Script not loaded yet, wait and try again
            setTimeout(initCalendlyWidget, 500);
        }
    }

    // Event listener for Calendly events
    window.addEventListener('message', function(event) {
        if (event.data.event === 'calendly.date_and_time_selected') {
            // Capture selected time details without booking
            const selectedTimeDetails = event.data.payload;
            const detailsInput = document.getElementById('selectedAppointmentDetails');
            if (detailsInput) {
                detailsInput.value = JSON.stringify(selectedTimeDetails);
                console.log('Time slot selected:', selectedTimeDetails);
                
                // Enable the Next button (optional)
                const nextBtn = document.querySelector('.form-step[data-step="4"] .next-btn');
                if (nextBtn) {
                    nextBtn.removeAttribute('disabled');
                }
            }
        }
    });

    // Override just the relevant part of nextStep
    const originalNextStep = window.nextStep;
    window.nextStep = function() {
        // Get current step
        const currentStep = document.querySelector('.form-step.active');
        const currentStepNumber = currentStep ? parseInt(currentStep.getAttribute('data-step')) : 0;
        
        // If moving to step 4, initialize Calendly
        if (currentStepNumber === 3) {
            // Call original next step first to make the calendar container visible
            if (typeof originalNextStep === 'function') {
                originalNextStep();
            } else {
                // Fallback if originalNextStep isn't defined
                document.querySelector('.form-step.active').classList.remove('active');
                document.querySelector('.form-step[data-step="4"]').classList.add('active');
            }
            
            // Initialize Calendly
            if (calendlyLoaded) {
                initCalendlyWidget();
            } else {
                // If Calendly hasn't loaded yet, show loading message
                document.getElementById('calendly-widget').innerHTML = 
                    '<div style="text-align: center; padding: 20px;">Loading calendar...</div>';
            }
        } else {
            // For other steps, just call the original function
            if (typeof originalNextStep === 'function') {
                originalNextStep();
            } else {
                // Fallback if originalNextStep isn't defined
                const nextStepNumber = currentStepNumber + 1;
                document.querySelector('.form-step.active').classList.remove('active');
                document.querySelector(`.form-step[data-step="${nextStepNumber}"]`).classList.add('active');
            }
        }
    };
});
