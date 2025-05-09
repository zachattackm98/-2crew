// Multi-step form functionality
let currentStep = 0; // Start with the first step (index 0)
const steps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const progressLines = document.querySelectorAll(".progress-line");

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", () => {
    if (steps.length === 0) return; // Exit if not on form page
    
    // Initialize the form
    showStep(currentStep);
    updateProgress();
    setupEventListeners();

});

// Function to show the current step
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });
    
    // If we're on the summary step, fill the summary
    if (index === steps.length - 1) {
        fillSummary();
    }
    
    // Update step-specific content
    if (index === 2) { // Plan selection step (index 2 = step 3)
        updatePlanCards();
    }
    
    updateProgress();
}

// Function to update progress indicators
function updateProgress() {
    progressSteps.forEach((step, i) => {
        if (i <= currentStep) {
            step.classList.add("active");
            step.classList.add("completed");
        } else {
            step.classList.remove("active");
            step.classList.remove("completed");
        }
    });
    
    // Update progress lines if they exist
    if (progressLines.length > 0) {
        progressLines.forEach((line, i) => {
            if (i < currentStep) {
                line.classList.add("active");
            } else {
                line.classList.remove("active");
            }
        });
    }
}

// Navigation functions
function nextStep() {
    // Validate current step before proceeding
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
        // Skip hidden fields
        if (input.classList.contains("hidden")) return;
        
        // Special handling for radio buttons
        if (input.type === "radio") {
            const name = input.name;
            const checked = currentStepElement.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                isValid = false;
                input.closest('.plan-options').classList.add('invalid');
            }
        } else if (!input.value.trim()) {
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
    if (!input) return;
    
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
        const ignoredFields = ["", null];
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

// Handle form submission
const form = document.getElementById("cleanupForm");
if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = document.querySelector('.submit-btn');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            submitButton.classList.add('processing');
        }
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const formDataObject = {};
            
            // Convert FormData to a regular object
            for (let [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }
            
            // Send data to Make.com webhook
            const response = await fetch('https://hook.us2.make.com/azb0lj2p19e6aj5jb2880r895uq7jrj8', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // Change content type
                },
                body: new URLSearchParams(formDataObject) // Use URLSearchParams instead of JSON.stringify
            });

            if (response.ok) {
                alert("Thank you for booking our service! We'll contact you shortly to confirm your appointment.");
                // Redirect to thank you page
                window.location.href = "thank-you.html";
            } else {
                throw new Error('Failed to submit form');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert("There was an issue processing your request. Please try again or contact us directly.");
            
            // Re-enable the submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Book Now';
                submitButton.classList.remove('processing');
            }
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
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
                
                // Update pricing when plan changes
                updatePricing();
            });
        });
    }
    
    // Add input validation styles
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        // Add validation styling on blur
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim() && !this.classList.contains('hidden')) {
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
    
    // Dogs select change event
    const dogsSelect = document.getElementById('dogs');
    if (dogsSelect) {
        dogsSelect.addEventListener('change', function() {
            updatePricing();
            updatePlanCards();
        });
    }
    
    // Trash can option change event
    const trashOptions = document.querySelectorAll('input[name="trashCanOption"]');
    trashOptions.forEach(option => {
        option.addEventListener('change', updatePricing);
    });
    
    // Community gate code toggle
    const communityGateSelect = document.getElementById('communityGate');
    if (communityGateSelect) {
        communityGateSelect.addEventListener('change', function() {
            toggleInput(this, 'communityCode');
        });
        
        // Initialize state
        toggleInput(communityGateSelect, 'communityCode');
    }
    
    // House gate code toggle
    const houseGateSelect = document.getElementById('houseGate');
    if (houseGateSelect) {
        houseGateSelect.addEventListener('change', function() {
            toggleInput(this, 'houseCode');
        });
        
        // Initialize state
        toggleInput(houseGateSelect, 'houseCode');
    }
}
