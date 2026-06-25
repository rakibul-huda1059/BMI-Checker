// BMI Checker Hub - script.js
document.addEventListener('DOMContentLoaded', function () {
  const heightInput = document.getElementById('height-value');
  const heightUnit = document.getElementById('height-unit');
  const weightInput = document.getElementById('weight-value');
  const weightUnit = document.getElementById('weight-unit');
  const calcBtn = document.getElementById('calc-btn');
  const resetBtn = document.getElementById('reset-btn');
  const errorEl = document.getElementById('error');
  const resultEl = document.getElementById('result');
  const tipsEl = document.getElementById('tips');

  function clearMessages() {
    errorEl.textContent = '';
    tipsEl.innerHTML = '';
  }

  function showError(text) {
    errorEl.textContent = text;
    resultEl.innerHTML = '<p class="muted">Your BMI will appear here after calculation.</p>';
    tipsEl.textContent = '';
  }

  function convertToKg(weight, unit) {
    if (unit === 'kg') return weight;
    // pounds to kg
    return weight * 0.45359237;
  }

  function convertToMeters(height, unit) {
    if (unit === 'cm') return height / 100;
    // inches to meters
    return height * 0.0254;
  }

  function classifyBMI(bmi) {
    if (bmi < 18.5) return { key: 'under', label: 'Underweight' };
    if (bmi < 25) return { key: 'normal', label: 'Normal' };
    if (bmi < 30) return { key: 'over', label: 'Overweight' };
    return { key: 'obese', label: 'Obese' };
  }

  function generateTips(categoryKey) {
    const tips = {
      under: [
        'Consider balanced meals with nutrient-rich foods.',
        'Gradually increase calorie intake with healthy choices.',
        'If weight loss is unintentional, consult a health professional.',
      ],
      normal: [
        'Maintain balanced nutrition and regular physical activity.',
        'Keep up healthy sleep and stress management habits.',
      ],
      over: [
        'Aim for a balanced diet and regular exercise routine.',
        'Small, consistent changes can help — like daily walks and portion awareness.',
        'Talk with a provider or nutritionist for personalized guidance.',
      ],
      obese: [
        'Consult a healthcare provider for personalized assessment and a safe plan.',
        'Consider gradual lifestyle changes: diet, activity, and sleep patterns.',
        'Support from professionals helps set realistic and sustainable goals.',
      ],
    };
    return tips[categoryKey] || [];
  }

  function displayResult(bmi, category) {
    // Clear previous messages
    clearMessages();

    const bmiRounded = Math.round(bmi * 10) / 10; // 1 decimal
    resultEl.innerHTML = `
      <div class="bmi-number" aria-hidden="true">${bmiRounded}</div>
      <div>
        <div class="category ${category.key}" aria-hidden="true">${category.label}</div>
        <div class="muted" style="margin-top:6px;">BMI categories (WHO): Underweight <18.5 — Normal 18.5–24.9 — Overweight 25–29.9 — Obese ≥30</div>
      </div>
    `;

    const tips = generateTips(category.key);
    if (tips.length) {
      tipsEl.innerHTML = '<strong>General tips:</strong><ul>' + tips.map(t => `<li>${t}</li>`).join('') + '</ul>';
    } else {
      tipsEl.textContent = '';
    }
  }

  function calculateBMI() {
    clearMessages();

    const heightVal = parseFloat(heightInput.value);
    const weightVal = parseFloat(weightInput.value);
    const hUnit = heightUnit.value;
    const wUnit = weightUnit.value;

    // Basic validation
    if (!heightVal || heightVal <= 0) {
      showError('Please enter a valid height greater than 0.');
      return;
    }
    if (!weightVal || weightVal <= 0) {
      showError('Please enter a valid weight greater than 0.');
      return;
    }

    // Convert
    const meters = convertToMeters(heightVal, hUnit);
    const kg = convertToKg(weightVal, wUnit);

    if (!isFinite(meters) || meters <= 0) {
      showError('Height conversion error. Please check your input and unit.');
      return;
    }
    if (!isFinite(kg) || kg <= 0) {
      showError('Weight conversion error. Please check your input and unit.');
      return;
    }

    // BMI = kg / (m^2)
    const bmi = kg / (meters * meters);
    if (!isFinite(bmi) || bmi <= 0) {
      showError('Calculation error. Please check your inputs.');
      return;
    }

    const category = classifyBMI(bmi);
    displayResult(bmi, category);
  }

  // Event listeners
  calcBtn.addEventListener('click', calculateBMI);
  resetBtn.addEventListener('click', function () {
    document.getElementById('bmi-form').reset();
    resultEl.innerHTML = '<p class="muted">Your BMI will appear here after calculation.</p>';
    tipsEl.innerHTML = '';
    clearMessages();
  });

  // Allow pressing Enter when focused in inputs to calculate
  document.getElementById('bmi-form').addEventListener('submit', function (e) {
    e.preventDefault();
    calculateBMI();
  });

  // Optional: immediate feedback if user changes units (keeps simplicity)
  // No auto-calculation on change to avoid surprising results; keep calculation explicit.
});