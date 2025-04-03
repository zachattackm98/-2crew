const steps = document.querySelectorAll(".form-step");
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
  if (index === steps.length - 1) fillSummary();
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

function toggleInput(select, inputId) {
  const input = document.getElementById(inputId);
  input.classList.toggle("hidden", select.value !== "yes");
  if (select.value === "yes") {
    input.setAttribute("required", "required");
  } else {
    input.removeAttribute("required");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);

  document.getElementById("cleanupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Form submitted! Thank you for scheduling your pet cleanup.");
  });
});

function fillSummary() {
  const form = document.getElementById("cleanupForm");
  const formData = new FormData(form);
  const ignoredFields = ["card", "", null];
  let summaryHtml = '<ul>';
  for (let [key, value] of formData.entries()) {
    if (value && !ignoredFields.includes(key)) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
      summaryHtml += `<li><strong>${label}:</strong> ${value}</li>`;
    }
  }
  summaryHtml += '</ul>';
  document.getElementById("summary").innerHTML = summaryHtml;
}
