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
// Track if Calendly script is loaded
let calendlyScriptLoaded = false;

// Load Calendly script once on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only run this on pages with the form
    if (!document.getElementById('cleanupForm')) return;
    
    // Add Calendly CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #calendly-widget {
            min-height: 650px;
            width: 100%;
        }
        .calendly-inline-widget {
            min-height: 650px !important;
        }
        .loading-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            font-size: 18px;
            color: #00796b;
        }
    `;
    document.head.appendChild(style);
    
    // Load Calendly script if not already loaded
    if (!document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        
        script.onload = function() {
            console.log("Calendly script loaded successfully");
            calendlyScriptLoaded = true;
            
            // If we're already on step 4, initialize widget
            if (currentStep === 3) { // currentStep is 0-indexed in your code
                initCalendlyWidget();
            }
        };
        
        script.onerror = function() {
            console.error("Failed to load Calendly script");
            const widget = document.getElementById('calendly-widget');
            if (widget) {
                widget.innerHTML = '<div class="error-message">Failed to load calendar. Please refresh and try again.</div>';
            }
        };
        
        document.head.appendChild(script);
    } else {
        calendlyScriptLoaded = true;
    }
    
    // Add event listener for Calendly events
    window.addEventListener('message', function(event) {
        if (event.data.event && event.origin.indexOf('calendly.com') !== -1) {
            console.log("Calendly event:", event.data.event);
            
            // When a time slot is selected
            if (event.data.event === 'calendly.date_and_time_selected') {
                console.log("Time slot selected:", event.data.payload);
                const detailsInput = document.getElementById('selectedAppointmentDetails');
                if (detailsInput) {
                    detailsInput.value = JSON.stringify(event.data.payload);
                }
            }
        }
    });
    
    // Override the original nextStep function to handle Calendly integration
    const originalNextStep = window.nextStep;
    
    window.nextStep = function() {
        // Get current step before it changes
        const beforeStep = currentStep;
        
        // Call the original nextStep function
        originalNextStep();
        
        // If we just moved to step 4 (index 3), initialize Calendly
        if (beforeStep === 2 && currentStep === 3) {
            initCalendlyWidget();
        }
    };
});

// Function to initialize the Calendly widget
function initCalendlyWidget() {
    // Get the widget container
    const calendlyWidget = document.getElementById('calendly-widget');
    if (!calendlyWidget) {
        console.error("Cannot find calendly-widget element");
        return;
    }
    
    // Show loading indicator
    calendlyWidget.innerHTML = '<div class="loading-indicator">Loading calendar...</div>';
    
    // Get form values
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    
    console.log("Form data for Calendly:", { name, email, phone });
    
    // Validation
    if (!name || !email) {
        calendlyWidget.innerHTML = '<div class="error-message">Please fill in your name and email in Step 1 before scheduling.</div>';
        return;
    }
    
    // Wait for Calendly to load if needed
    function attemptToInitialize() {
        if (typeof Calendly !== 'undefined') {
            try {
                // Clear the container
                calendlyWidget.innerHTML = '';
                
                // Initialize with prefilled data
                Calendly.initInlineWidget({
                    url: 'https://calendly.com/zachm98/30min?hide_gdpr_banner=1',
                    parentElement: calendlyWidget,
                    prefill: {
                        name: name,
                        email: email,
                        customAnswers: {
                            a1: phone // This is to prefill phone as a custom field
                        }
                    }
                });
                
                console.log("Calendly widget initialized successfully");
            } catch (error) {
                console.error("Error initializing Calendly widget:", error);
                calendlyWidget.innerHTML = '<div class="error-message">Failed to load calendar. Please refresh and try again.</div>';
            }
        } else {
            // Retry after a short delay
            console.log("Calendly not loaded yet, retrying in 500ms");
            setTimeout(attemptToInitialize, 500);
        }
    }
    
    // Start initialization
    attemptToInitialize();
}

// Update the fillSummary function to include appointment details
const originalFillSummary = window.fillSummary;

window.fillSummary = function() {
    // Call the original function first
    if (typeof originalFillSummary === 'function') {
        originalFillSummary();
    }
    
    // Add appointment details to summary if available
    const summaryElement = document.getElementById("summary");
    const appointmentDetails = document.getElementById('selectedAppointmentDetails')?.value;
    
    if (summaryElement && appointmentDetails) {
        try {
            const details = JSON.parse(appointmentDetails);
            const appointmentDate = new Date(details.start_time);
            
            // Format date and time nicely
            const dateString = appointmentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const timeString = appointmentDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Add appointment info to the summary
            const appointmentHTML = `
                <li class="summary-category">
                    <strong>Scheduled Appointment</strong>
                    <ul>
                        <li><strong>Date:</strong> ${dateString}</li>
                        <li><strong>Time:</strong> ${timeString}</li>
                    </ul>
                </li>
            `;
            
            // Find where to insert this information
            const summaryList = summaryElement.querySelector('.summary-list');
            if (summaryList) {
                // Try to insert after Service Details if it exists
                const serviceDetails = summaryList.querySelector('.summary-category:nth-child(3)');
                if (serviceDetails) {
                    serviceDetails.insertAdjacentHTML('afterend', appointmentHTML);
                } else {
                    // Otherwise just append to the end
                    summaryList.insertAdjacentHTML('beforeend', appointmentHTML);
                }
            }
        } catch (e) {
            console.error("Error parsing appointment details:", e);
        }
    }
};
