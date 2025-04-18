// Multi-step form functionality
let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const progressLines = document.querySelectorAll(".progress-line");

// Initialize when document is ready
// Modify your form submission handler in the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    if (steps.length === 0) return; // Exit if not on form page
    
    showStep(currentStep);
    updateProgress();
    
    // Form submission handler
    const form = document.getElementById("cleanupForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Get all form data
            const formData = new FormData(form);
            const formDataObject = {};
            
            // Convert FormData to a regular object
            for (let [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }
            
            // Add additional information if needed
            // For example, add the total price calculated
            const totalPriceElement = document.getElementById('finalPrice');
            if (totalPriceElement) {
                formDataObject.totalPrice = totalPriceElement.textContent;
            }
            
            // Send data to Zapier webhook
            fetch('https://hooks.zapier.com/hooks/catch/22450304/20l4fs2/', {
                method: 'POST',
                body: JSON.stringify(formDataObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Thank you for booking our service! We'll contact you shortly to confirm your appointment.");
                    // Optional: Reset form or redirect to a thank you page
                    // form.reset();
                    // window.location.href = "thank-you.html";
                } else {
                    alert("There was an issue submitting your form. Please try again or contact us directly.");
                    console.error('Submission error:', response);
                }
            })
            .catch(error => {
                alert("There was an issue submitting your form. Please try again or contact us directly.");
                console.error('Submission error:', error);
            });
        });
    }
    
    // Rest of your initialization code...
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

// Update pricing when plan, number of dogs, or waste disposal option changes
function updatePricing() {
    // Get selected plan
    const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
    const totalPriceElement = document.getElementById('totalPrice');
    
    // Get number of dogs
    const dogsSelect = document.getElementById('dogs');
    const numberOfDogs = dogsSelect ? parseInt(dogsSelect.value) || 1 : 1;
    
    // Check if "we haul" option is selected
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
    
    // Calculate total price
    if (selectedPlan && totalPriceElement) {
        const basePriceText = selectedPlan.closest('.plan-card').querySelector('.plan-price').textContent;
        let basePrice = parseFloat(basePriceText.replace(/[^0-9.]/g, ''));
        
        // Add $5 for each extra dog without explicitly mentioning it
        const adjustedPrice = basePrice + ((numberOfDogs - 1) * 5);
        
        // Add $5 for "we haul" service if selected
        let totalPrice = adjustedPrice;
        if (weHaulOption && weHaulOption.checked) {
            totalPrice += 5;
        }
        
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Function to fill the price breakdown in the summary
function fillPriceBreakdown() {
    console.log("Starting fillPriceBreakdown function");
    
    const priceBreakdownElement = document.getElementById('priceBreakdown');
    if (!priceBreakdownElement) {
        console.error("Price breakdown element not found");
        return;
    }
    
    // Get selected plan information
    const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
    if (!selectedPlan) {
        console.warn("No plan selected yet");
        priceBreakdownElement.innerHTML = '<li><span>No plan selected</span></li>';
        return;
    }
    
    try {
        // Get plan information
        const planCardElement = selectedPlan.closest('.plan-card');
        const planCardContent = planCardElement.querySelector('.plan-card-content');
        const planNameElement = planCardContent.querySelector('h4');
        const planName = planNameElement.textContent;
        
        // Base prices - use these directly rather than from UI
        let basePrice;
        if (planName === "Weekly Service") {
            basePrice = 20;
        } else if (planName === "Twice Weekly") {
            basePrice = 15;
        } else if (planName === "Thrice Weekly") {
            basePrice = 15;
        } else if (planName === "Bi-Weekly") {
            basePrice = 35;
        } else {
            // If unknown plan, get from UI as fallback
            const priceElement = planCardContent.querySelector('.plan-price');
            basePrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
        }
        
        // Get number of dogs
        const dogsSelect = document.getElementById('dogs');
        const numberOfDogs = dogsSelect ? parseInt(dogsSelect.value) || 1 : 1;
        
        // Calculate adjusted price
        const adjustedPrice = basePrice + ((numberOfDogs - 1) * 5);
        
        // Check if "we haul" option is selected
        const weHaulOption = document.querySelector('input[name="trashCanOption"][value="weHaul"]:checked');
        const weHaulCost = weHaulOption ? 5 : 0;
        
        // Calculate total price
        const totalPrice = adjustedPrice + weHaulCost;
        
        // Create breakdown HTML
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
    } catch (error) {
        console.error("Error in fillPriceBreakdown:", error);
        priceBreakdownElement.innerHTML = '<li><span>Error calculating price: ' + error.message + '</span></li>';
    }
}

// Generate summary of form data
function fillSummary() {
    try {
        const form = document.getElementById("cleanupForm");
        if (!form) {
            console.log("Form not found");
            return;
        }
        
        // Call the price breakdown function
        fillPriceBreakdown();
        
        const summaryElement = document.getElementById("summary");
        if (!summaryElement) {
            console.log("Summary element not found");
            return;
        }
        
        const formData = new FormData(form);
        const ignoredFields = ["card", "cardNumber", "expiry", "cvc", "", null];
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
        // In your fillSummary() function
        if (['name', 'phone', 'email', 'address'].includes(key)) {
            contactInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
        } else if (['dogs', 'yardSize', 'lastClean'].includes(key)) {
            petInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
        } else if (['plan', 'date'].includes(key)) {
            // Special handling for the plan to get the current price
            if (key === 'plan') {
                const selectedPlan = document.querySelector('.plan-card input[type="radio"]:checked');
                if (selectedPlan) {
                    // Get the plan name directly from the content rather than the value
                    const planCard = selectedPlan.closest('.plan-card');
                    const planName = planCard.querySelector('h4').textContent;
                    const priceText = planCard.querySelector('.plan-price').textContent;
                    
                    // Get number of dogs for display
                    const dogsSelect = document.getElementById('dogs');
                    const numberOfDogs = dogsSelect ? parseInt(dogsSelect.value) || 1 : 1;
                    
                    // Create an updated plan string that reflects the current price
                    const dynamicPlanString = `${planName} (${numberOfDogs} ${numberOfDogs === 1 ? 'dog' : 'dogs'}) - ${priceText}`;
                    serviceInfo.push(`<li><strong>${label}:</strong> ${dynamicPlanString}</li>`);
                } else {
                    serviceInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
                }
            } else {
                serviceInfo.push(`<li><strong>${label}:</strong> ${value}</li>`);
            }
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
        
        summaryElement.innerHTML = summaryHtml;
    } catch (error) {
        console.error("Error in fillSummary:", error);
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

// Function to update plan prices when number of dogs changes
function updatePlanCards() {
    const dogsSelect = document.getElementById('dogs');
    const numberOfDogs = dogsSelect ? parseInt(dogsSelect.value) || 1 : 1;
    
    // Get base prices
    const weeklyBasePrice = 20;
    const twiceWeeklyBasePrice = 15;
    const thriceWeeklyBasePrice = 15;
    const biweeklyBasePrice = 35;
    
    // Only adjust prices if more than one dog
    if (numberOfDogs > 1) {
        const extraDogs = numberOfDogs - 1;
        const extraCost = extraDogs * 5;
        
        // Update each plan price
        updatePlanPrice('weekly-price', weeklyBasePrice + extraCost);
        updatePlanPrice('twice-weekly-price', twiceWeeklyBasePrice + extraCost);
        updatePlanPrice('thrice-weekly-price', thriceWeeklyBasePrice + extraCost);
        updatePlanPrice('biweekly-price', biweeklyBasePrice + extraCost);
    } else {
        // Reset to base prices if only one dog
        updatePlanPrice('weekly-price', weeklyBasePrice);
        updatePlanPrice('twice-weekly-price', twiceWeeklyBasePrice);
        updatePlanPrice('thrice-weekly-price', thriceWeeklyBasePrice);
        updatePlanPrice('biweekly-price', biweeklyBasePrice);
    }
}

// Helper function to update a specific plan's price
function updatePlanPrice(elementId, price) {
    const priceElement = document.getElementById(elementId);
    if (priceElement) {
        priceElement.textContent = `$${price.toFixed(2)}`;
    }
}

// Add this to your event listener for dogs select
document.addEventListener('DOMContentLoaded', () => {
    const dogsSelect = document.getElementById('dogs');
    if (dogsSelect) {
        dogsSelect.addEventListener('change', function() {
            updatePricing();
            updatePlanCards();
        });
    }
    
    // Also call it when navigating to step 3
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach((button, index) => {
        if (index === 1) { // Button for step 2 going to step 3
            button.addEventListener('click', function() {
                updatePlanCards();
            });
        }
    });
});
