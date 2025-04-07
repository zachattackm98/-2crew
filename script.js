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

document.addEventListener('DOMContentLoaded', () => {
    // Load Calendly script dynamically
    const calendlyScript = document.createElement('script');
    calendlyScript.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyScript.async = true;
    document.head.appendChild(calendlyScript);

    function initCalendlyWidget() {
        // Capture contact details from first step
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();

        // Construct Calendly URL with prefilled parameters
        const calendlyUrl = `https://calendly.com/zachm98/30min?` +
            `name=${encodeURIComponent(name)}` +
            `&email=${encodeURIComponent(email)}` +
            `&a1=${encodeURIComponent(phone)}`;

        // Initialize Calendly widget
        const calendlyWidget = document.getElementById('calendly-widget');
        calendlyWidget.innerHTML = ''; // Clear existing widget
        calendlyWidget.setAttribute('data-url', calendlyUrl);

        // Wait for Calendly script to load
        calendlyScript.onload = () => {
            Calendly.initInlineWidget({
                url: calendlyUrl,
                parentElement: calendlyWidget,
                welcomeScreenOptions: {
                    showName: false,
                    showEmail: false
                }
            });
        };
    }

    // Event listener for Calendly events
    window.addEventListener('message', function(event) {
        if (event.data.event === 'calendly.date_and_time_selected') {
            // Capture selected time details without booking
            const selectedTimeDetails = event.data.payload;
            document.getElementById('selectedAppointmentDetails').value = JSON.stringify(selectedTimeDetails);
            console.log('Time slot selected (not booked):', selectedTimeDetails);
        }
    });

    // Modify next step function to initialize widget
    const originalNextStep = window.nextStep;
    window.nextStep = function() {
        if (currentStep === 4) {
            initCalendlyWidget();
        }
        
        // Call the original next step function
        if (originalNextStep) {
            originalNextStep();
        }
    };
});
