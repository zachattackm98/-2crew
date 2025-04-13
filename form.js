// Multi-step form functionality
let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const progressLines = document.querySelectorAll(".progress-line");

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
    if (steps.length === 0) return; // Exit if not on form page

    showStep(currentStep);
    updateProgress();

    // Form submission handler
    const form = document.getElementById("cleanupForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Thank you for booking our service! We'll contact you shortly to confirm your appointment.");
            // In production, you would handle the form submission via AJAX here
        });
    }

    // Set up event listener for trash can location options
    const trashCanOptions = document.querySelectorAll('input[name="trashCanOption"]');
    if (trashCanOptions.length) {
        trashCanOptions.forEach(option => {
            option.addEventListener('change', updatePricing);
        });
    }

    // Plan selection highlights
    const planCards = document.querySelectorAll('.plan-card input[type="radio"]');
    if (planCards.length) {
        planCards.forEach(radio => {
            radio.addEventListener('change', function () {
                // Update appearances
                document.querySelectorAll('.plan-card').forEach(card => {
                    card.classList.remove('selected');
                });

                if (this.checked) {
                    this.closest('.plan-card').classList.add('selected');
                }
            });
        });
    }

    // Add input validation styles
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => {
        // Add validation styling on blur
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });

        // Remove validation styling when typing
        input.addEventListener('input', function () {
            this.classList.remove('invalid');
        });
    });

    // Add this to your event listener for dogs select
    const dogsSelect = document.getElementById('dogs');
    if (dogsSelect) {
        dogsSelect.addEventListener('change', function () {
            updatePricing();
            updatePlanCards();
        });
    }

    // Also call it when navigating to step 3
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach((button, index) => {
        if (index === 1) { // Button for step 2 going to step 3
            button.addEventListener('click', function () {
                updatePlanCards();
            });
        }
    });

});

// Function to show the current step
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    if (index === steps.length - 1) {
        // Call fillSummary() after a slight delay to ensure DOM is ready
        setTimeout(fillSummary, 10);
    }

    updateProgress();
}

// ... (rest of your functions: updateProgress(), nextStep(), prevStep(), validateCurrentStep(), toggleInput(), updatePricing(), updatePlanCards(), updatePlanPrice() remain the same)

// Generate summary of form data
function fillSummary() {
    const form = document.getElementById("cleanupForm");
    if (!form) return;
    fillPriceBreakdown();

    const formData = new FormData(form);
    const ignoredFields = ["card", "", null];
    let summaryHtml = '<ul class="summary-list">';

    // Group data by categories for better organization
    const contactInfo = [];
    const petInfo = [];
    const serviceInfo = [];
    const accessInfo = [];

    for (let [key, value] of formData.entries()) {
        if (value && !ignoredFields.includes(key)) {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());

            // Sort into categories
            if (['name', 'phone', 'email', 'address'].includes(key)) {
                contactInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
            } else if (['dogs', 'yardSize', 'lastClean'].includes(key)) {
                petInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
            } else if (['plan', 'date'].includes(key)) {
                serviceInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
            } else {
                // Special handling for trash can option to show the fee
                if (key === 'trashCanOption' && value === 'weHaul') {
                    accessInfo.push(`<li><strong>Trash Can Option:</strong> We Haul (+ $5.00)</li>`);
                } else {
                    accessInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
                }
            }
        }
    }

    // Function to fill the price breakdown in the summary
    function fillPriceBreakdown() {
        const priceBreakdownElement = document.getElementById('priceBreakdown');
        if (!priceBreakdownElement) return;

        // Get selected plan information
        const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
        if (!selectedPlan) return;

        const planName = selectedPlan.closest('.plan-card-content').querySelector('h4').textContent;
        const basePriceText = selectedPlan.closest('.plan-card-content').querySelector('.plan-price').textContent;
        const basePrice = parseFloat(basePriceText.replace(/[^0-9.]/g, ''));

        // Get number of dogs
        const dogsSelect = document.getElementById('dogs');
        const numberOfDogs = dogsSelect ? parseInt(dogsSelect.value) || 1 : 1;

        // Calculate adjusted price based on number of dogs
        const adjustedPrice = basePrice + ((numberOfDogs - 1) * 5);

        // Check if "we haul" option is selected
        const weHaulOption = document.querySelector('input[name="trashCanOption"][value="weHaul"]:checked');
        const weHaulCost = weHaulOption ? 5 : 0;

        // Calculate total price
        const totalPrice = adjustedPrice + weHaulCost;

        // Create breakdown HTML - simplified version
        let breakdownHtml = `
            <li><span>${planName} (${numberOfDogs} ${numberOfDogs === 1 ? 'dog' : 'dogs'}):</span> <span>$${adjustedPrice.toFixed(2)}</span></li>
        `;

        if (weHaulOption) {
            breakdownHtml += `
                <li><span>We Haul Service:</span> <span>$5.00</span></li>
            `;
        }

        breakdownHtml += `
            <li><span>Total:</span> <span id="finalPrice">$${totalPrice.toFixed(2)}</span></li>
        `;

        priceBreakdownElement.innerHTML = breakdownHtml;
    }

    // Add each category to the summary
    if (contactInfo.length) {
        summaryHtml += '<li class="summary-category"><strong>Contact Information</strong><ul>';
        summaryHtml += contactInfo.join('');
        summaryHtml += '</ul></li>';
    }

    if (petInfo.length) {
        summaryHtml += '<li class="summary-category"><strong>Pet & Yard Details</strong><ul>';
        summaryHtml += petInfo.join('');
        summaryHtml += '</ul></li>';
    }

    if (serviceInfo.length) {
        summaryHtml += '<li class="summary-category"><strong>Service Details</strong><ul>';
        summaryHtml += serviceInfo.join('');
        summaryHtml += '</ul></li>';
    }

    if (accessInfo.length) {
        summaryHtml += '<li class="summary-category"><strong>Access Information</strong><ul>';
        summaryHtml += accessInfo.join('');
        summaryHtml += '</ul></li>';
    }

    summaryHtml += '</ul>';

    const summaryElement = document.getElementById("summary");
    if (summaryElement) {
        summaryElement.innerHTML = summaryHtml;
    }

    // Update total price if we haul option is selected
    const weHaulOption = document.querySelector('input[name="trashCanOption"][value="weHaul"]:checked');
    const totalPriceElement = document.getElementById('totalPrice');

    if (weHaulOption && totalPriceElement) {
        // Get the base price from the selected plan
        const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
        if (selectedPlan) {
            const basePriceText = selectedPlan.closest('.plan-card').querySelector('.plan-price').textContent;
            const basePrice = parseFloat(basePriceText.replace(/[^0-9.]/g, ''));

            // Add $5 for we haul service
            const totalPrice = basePrice + 5;
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }
}
