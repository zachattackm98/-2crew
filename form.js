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
        form.addEventListener("submit", function(e) {
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
});

// Function to show the current step
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });
    
    if (index === steps.length - 1) {
        fillSummary();
    }
    
    updateProgress();
}

// Function to update progress indicators
function updateProgress() {
    progressSteps.forEach((step, i) => {
        if (i <= currentStep) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
        
        if (i < currentStep) {
            step.classList.add("completed");
        } else {
            step.classList.remove("completed");
        }
    });
    
    progressLines.forEach((line, i) => {
        if (i < currentStep) {
            line.classList.add("active");
        } else {
            line.classList.remove("active");
        }
    });
}

// Navigation functions
function nextStep() {
    // You could add validation here before proceeding
    if (validateCurrentStep()) {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

// Simple validation function - could be expanded as needed
function validateCurrentStep() {
    const currentStepElement = steps[currentStep];
    const requiredInputs = currentStepElement.querySelectorAll("[required]");
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (input.classList.contains("hidden")) return;
        
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("invalid");
            
            // Remove invalid class when user types
            input.addEventListener("input", function() {
                if (this.value.trim()) {
                    this.classList.remove("invalid");
                }
            }, { once: true });
        } else {
            input.classList.remove("invalid");
        }
    });
    
    if (!isValid) {
        alert("Please fill in all required fields before proceeding.");
    }
    
    return isValid;
}

// Toggle dependent inputs based on selection
function toggleInput(select, inputId) {
    const input = document.getElementById(inputId);
    const isVisible = select.value === "yes";
    
    input.classList.toggle("hidden", !isVisible);
    
    if (isVisible) {
        input.setAttribute("required", "required");
    } else {
        input.removeAttribute("required");
    }
}

// Update pricing when "we haul" option is selected
function updatePricing() {
    const weHaulOption = document.querySelector('input[name="trashCanOption"][value="weHaul"]');
    const additionalCostElement = document.getElementById('additionalCost');
    
    if (weHaulOption && additionalCostElement) {
        if (weHaulOption.checked) {
            additionalCostElement.textContent = '$5.00';
            additionalCostElement.closest('.additional-cost').classList.remove('hidden');
        } else {
            additionalCostElement.closest('.additional-cost').classList.add('hidden');
        }
    }
    
    // Update total price display
    const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (selectedPlan && totalPriceElement) {
        const basePriceText = selectedPlan.closest('.plan-card').querySelector('.plan-price').textContent;
        const basePrice = parseFloat(basePriceText.replace(/[^0-9.]/g, ''));
        
        let totalPrice = basePrice;
        if (weHaulOption && weHaulOption.checked) {
            totalPrice += 5; // Add $5 for we haul service
        }
        
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Generate summary of form data
function fillSummary() {
    const form = document.getElementById("cleanupForm");
    if (!form) return;
    
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

// Plan selection highlights
const planCards = document.querySelectorAll('.plan-card input[type="radio"]');
if (planCards.length) {
    planCards.forEach(radio => {
        radio.addEventListener('change', function() {
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
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Add validation styling on blur
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
        
        // Remove validation styling when typing
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
        });
    });
});
