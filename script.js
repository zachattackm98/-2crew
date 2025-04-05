document.addEventListener('DOMContentLoaded', () => {
    const expectItems = document.querySelectorAll('.expect-item');
    const expectHeaders = document.querySelectorAll('.expect-header');

    expectHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const dropdown = item.querySelector('.expect-dropdown');
            const isActive = item.classList.contains('active');

            // Close other open items
            expectItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.expect-dropdown').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                dropdown.style.maxHeight = null;
            } else {
                item.classList.add('active');
                dropdown.style.maxHeight = dropdown.scrollHeight + "px";
            }
        });
    });

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
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Animation on scroll
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
});
