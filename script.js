let display = document.getElementById('display');

// Persian digits mapping
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function convertToPersianDigits(number) {
    let result = number.toString();
    for (let i = 0; i < englishDigits.length; i++) {
        result = result.replace(new RegExp(englishDigits[i], 'g'), persianDigits[i]);
    }
    return result;
}

function convertToEnglishDigits(text) {
    let result = text.toString();
    for (let i = 0; i < persianDigits.length; i++) {
        result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    return result;
}

function appendToDisplay(value) {
    // Convert Persian digits to English for internal processing
    if (persianDigits.includes(value)) {
        const index = persianDigits.indexOf(value);
        value = englishDigits[index];
    }
    
    // Prevent multiple decimals
    let currentEnglish = convertToEnglishDigits(display.value);
    if (value === '.' && currentEnglish.includes('.') && 
        !['+', '-', '*', '/', '×', '÷'].some(op => currentEnglish.split(op).pop().includes('.'))) {
        return;
    }
    display.value += value;
    display.value = convertToPersianDigits(display.value);
}

function clearDisplay() {
    display.value = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        // Replace × with * for evaluation
        let expression = display.value.replace(/×/g, '*');
        let result = eval(expression);
        
        // Handle decimal precision
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(10));
        }
        
        display.value = result;
    } catch (error) {
    display.value = 'خطا';
    setTimeout(clearDisplay, 1000);
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    }
});
