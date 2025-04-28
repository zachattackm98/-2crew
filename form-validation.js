// form-validation.js - Complete validation for 2Crew Pet Cleanup form
// Add this script after form.js in your HTML file

// Main initialization function
(function() {
    // Wait for the DOM to be ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeValidation();
    } else {
        document.addEventListener('DOMContentLoaded', initializeValidation);
    }
    
    // Initialize all validation features
    function initializeValidation() {
        console.log('Initializing enhanced form validation');
        
        // Add form validation styles
        addValidationStyles();
        
        // Initialize field-specific validations
        initializeNameValidation();
        initializeEmailValidation();
        initializePhoneValidation();
        
        // Enhance the form validation
        enhanceFormValidation();
    }
    
    // Add necessary validation styles
    function addValidationStyles() {
        if (document.getElementById('form-validation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'form-validation-styles';
        style.textContent = `
            .form-control.validated {
                border-color: var(--success);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23198754' viewBox='0 0 16 16'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 10px center;
                background-size: 16px 16px;
                padding-right: 35px;
            }
            
            .form-control.invalid {
                border-color: var(--danger);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23dc3545' viewBox='0 0 16 16'%3E%3Cpath d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 10px center;
                background-size: 16px 16px;
                padding-right: 35px;
            }
            
            .validation-message {
                font-size: 0.8rem;
                margin-top: 5px;
            }
            
            .validation-message.error {
                color: var(--danger);
            }
            
            .validation-message.success {
                color: var(--success);
            }
            
            .validation-message.warning {
                color: #fd7e14;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Helper function to show validation messages
    function showValidationMessage(inputElement, message, type) {
        // Clear any existing message
        clearValidationMessage(inputElement);
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'validation-message ' + type;
        messageElement.textContent = message;
        
        // Insert after the input
        inputElement.parentNode.insertBefore(messageElement, inputElement.nextSibling);
        
        // Auto-remove success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 3000);
        }
    }
    
    // Helper function to clear validation messages
    function clearValidationMessage(inputElement) {
        const existingMessage = inputElement.parentNode.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    // Validate name field
    function initializeNameValidation() {
        const nameInput = document.getElementById('name');
        if (!nameInput) return;
        
        // Real-time validation
        nameInput.addEventListener('input', function() {
            // Remove any existing messages
            clearValidationMessage(this);
            
            // Apply validation classes
            const isEmpty = this.value.trim() === '';
            this.classList.toggle('validated', !isEmpty);
            this.classList.toggle('invalid', false);
        });
        
        // Validate on blur
        nameInput.addEventListener('blur', function() {
            const isEmpty = this.value.trim() === '';
            this.classList.toggle('invalid', isEmpty);
            this.classList.toggle('validated', !isEmpty);
            
            if (isEmpty) {
                showValidationMessage(this, 'Name is required', 'error');
            }
        });
    }
    
    // Validate email field
    function initializeEmailValidation() {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        
        // Email validation regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Real-time validation
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            
            // Remove any existing messages
            clearValidationMessage(this);
            
            // Remove validation classes when user edits
            this.classList.remove('validated');
            this.classList.remove('invalid');
            
            // If the field is not empty, check format
            if (email !== '') {
                if (emailPattern.test(email)) {
                    this.classList.add('validated');
                }
            }
        });
        
        // Validate on blur
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email === '') {
                this.classList.add('invalid');
                showValidationMessage(this, 'Email is required', 'error');
            } else if (!emailPattern.test(email)) {
                this.classList.add('invalid');
                showValidationMessage(this, 'Please enter a valid email address', 'error');
            } else {
                this.classList.add('validated');
                // Show success message briefly
                showValidationMessage(this, 'Valid email format', 'success');
            }
        });
    }
    
    // Validate phone field with formatting
    function initializePhoneValidation() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        // Format as user types
        phoneInput.addEventListener('input', function() {
            // Get input value and remove non-numeric characters
            let input = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            input = input.substring(0, 10);
            
            // Format the number as user types
            if (input.length > 0) {
                // Format as (XXX) XXX-XXXX
                if (input.length <= 3) {
                    input = '(' + input;
                } else if (input.length <= 6) {
                    input = '(' + input.substring(0, 3) + ') ' + input.substring(3);
                } else {
                    input = '(' + input.substring(0, 3) + ') ' + input.substring(3, 6) + '-' + input.substring(6);
                }
            }
            
            // Update the input value
            this.value = input;
            
            // Clear validation messages
            clearValidationMessage(this);
            
            // Apply validation styles
            const digits = input.replace(/\D/g, '');
            this.classList.remove('validated');
            this.classList.remove('invalid');
            
            if (digits.length === 10) {
                this.classList.add('validated');
            }
        });
        
        // Validate on blur
        phoneInput.addEventListener('blur', function() {
            const digits = this.value.replace(/\D/g, '');
            
            if (digits.length === 0) {
                this.classList.add('invalid');
                showValidationMessage(this, 'Phone number is required', 'error');
            } else if (digits.length < 10) {
                this.classList.add('invalid');
                showValidationMessage(this, 'Please enter a complete 10-digit phone number', 'error');
            } else {
                this.classList.add('validated');
                // Show success message briefly
                showValidationMessage(this, 'Valid phone number', 'success');
            }
        });
    }
    
    // Enhance the original form validation
    function enhanceFormValidation() {
        // Store reference to the original validation function
        const originalValidateCurrentStep = window.validateCurrentStep;
        
        // Replace with our enhanced version
        window.validateCurrentStep = function() {
            let isValid = true;
            
            // Call the original validation function if it exists
            if (typeof originalValidateCurrentStep === 'function') {
                isValid = originalValidateCurrentStep();
            }
            
            // If already invalid, no need to check further
            if (!isValid) return false;
            
            // Get the current step element
            const currentStepElement = document.querySelector('.form-step.active');
            if (!currentStepElement) return isValid;
            
            // If we're on step 1 (index 0), do enhanced validation
            if (window.currentStep === 0) {
                // Validate name
                const nameInput = document.getElementById('name');
                if (nameInput && nameInput.value.trim() === '') {
                    nameInput.classList.add('invalid');
                    showValidationMessage(nameInput, 'Name is required', 'error');
                    isValid = false;
                }
                
                // Validate email
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    const email = emailInput.value.trim();
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (email === '') {
                        emailInput.classList.add('invalid');
                        showValidationMessage(emailInput, 'Email is required', 'error');
                        isValid = false;
                    } else if (!emailPattern.test(email)) {
                        emailInput.classList.add('invalid');
                        showValidationMessage(emailInput, 'Please enter a valid email address', 'error');
                        isValid = false;
                    }
                }
                
                // Validate phone
                const phoneInput = document.getElementById('phone');
                if (phoneInput) {
                    const digits = phoneInput.value.replace(/\D/g, '');
                    if (digits.length === 0) {
                        phoneInput.classList.add('invalid');
                        showValidationMessage(phoneInput, 'Phone number is required', 'error');
                        isValid = false;
                    } else if (digits.length < 10) {
                        phoneInput.classList.add('invalid');
                        showValidationMessage(phoneInput, 'Please enter a complete 10-digit phone number', 'error');
                        isValid = false;
                    }
                }
                
                // Validate address
                const addressInput = document.getElementById('address');
                if (addressInput && addressInput.value.trim() === '') {
                    addressInput.classList.add('invalid');
                    showValidationMessage(addressInput, 'Address is required', 'error');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                // Scroll to the first invalid input
                const firstInvalid = currentStepElement.querySelector('.invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            
            return isValid;
        };
    }
})();
