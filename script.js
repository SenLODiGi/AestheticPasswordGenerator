// DOM Elements
const passwordResult = document.getElementById('password-result');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const useKeywordsCheckbox = document.getElementById('use-keywords');
const beautifyKeywordsCheckbox = document.getElementById('beautify-keywords');
const keywordsInput = document.getElementById('keywords-input');
const keywordsDisplay = document.getElementById('keywords-display');
const easyPreset = document.getElementById('easy-preset');
const mediumPreset = document.getElementById('medium-preset');
const strongPreset = document.getElementById('strong-preset');
const generateBtn = document.getElementById('generate-btn');
const strengthFill = document.querySelector('.strength-fill');
const securityLevelValue = document.querySelector('.level-value');
const matrixCanvas = document.getElementById('matrix-bg');

// Character Sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Default Settings
let passwordLength = 12;
let includeUppercase = true;
let includeLowercase = true;
let includeNumbers = true;
let includeSymbols = true;
let useKeywords = true;
let beautifyKeywords = true;
let keywords = ['Ocean', 'Moon', 'Tiger'];
let currentPreset = 'medium';

// Initialize Matrix Background
function initMatrix() {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    const matrix = () => {
        ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        ctx.fillStyle = '#00ff9d';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };
    
    setInterval(matrix, 50);
}

// Update UI based on slider value
lengthSlider.addEventListener('input', () => {
    passwordLength = parseInt(lengthSlider.value);
    lengthValue.textContent = passwordLength;
    updateStrengthMeter();
});

// Update checkboxes and settings
uppercaseCheckbox.addEventListener('change', () => {
    includeUppercase = uppercaseCheckbox.checked;
    ensureAtLeastOneChecked();
    updateStrengthMeter();
});

lowercaseCheckbox.addEventListener('change', () => {
    includeLowercase = lowercaseCheckbox.checked;
    ensureAtLeastOneChecked();
    updateStrengthMeter();
});

numbersCheckbox.addEventListener('change', () => {
    includeNumbers = numbersCheckbox.checked;
    ensureAtLeastOneChecked();
    updateStrengthMeter();
});

symbolsCheckbox.addEventListener('change', () => {
    includeSymbols = symbolsCheckbox.checked;
    ensureAtLeastOneChecked();
    updateStrengthMeter();
});

useKeywordsCheckbox.addEventListener('change', () => {
    useKeywords = useKeywordsCheckbox.checked;
    keywordsInput.disabled = !useKeywords;
    beautifyKeywordsCheckbox.disabled = !useKeywords;
    updateStrengthMeter();
});

beautifyKeywordsCheckbox.addEventListener('change', () => {
    beautifyKeywords = beautifyKeywordsCheckbox.checked;
    updateStrengthMeter();
});

// Handle keywords input
keywordsInput.addEventListener('input', () => {
    const input = keywordsInput.value.trim();
    keywords = input.split(',').map(k => k.trim()).filter(k => k).slice(0, 3); // Limit to 3 keywords
    updateKeywordsDisplay();
    updateStrengthMeter();
});

// Update keywords display
function updateKeywordsDisplay() {
    keywordsDisplay.innerHTML = '';
    keywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        keywordsDisplay.appendChild(tag);
    });
}

// Ensure at least one character type is selected
function ensureAtLeastOneChecked() {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols && !useKeywords) {
        lowercaseCheckbox.checked = true;
        includeLowercase = true;
    }
}

// Preset buttons
easyPreset.addEventListener('click', () => {
    setPreset('easy');
});

mediumPreset.addEventListener('click', () => {
    setPreset('medium');
});

strongPreset.addEventListener('click', () => {
    setPreset('strong');
});

// Set preset configurations
function setPreset(preset) {
    currentPreset = preset;
    
    // Remove active class from all preset buttons
    easyPreset.classList.remove('active');
    mediumPreset.classList.remove('active');
    strongPreset.classList.remove('active');
    
    switch (preset) {
        case 'easy':
            easyPreset.classList.add('active');
            passwordLength = 8;
            includeUppercase = true;
            includeLowercase = true;
            includeNumbers = true;
            includeSymbols = false;
            useKeywords = false;
            beautifyKeywords = false;
            break;
        case 'medium':
            mediumPreset.classList.add('active');
            passwordLength = 12;
            includeUppercase = true;
            includeLowercase = true;
            includeNumbers = true;
            includeSymbols = true;
            useKeywords = true;
            beautifyKeywords = true;
            break;
        case 'strong':
            strongPreset.classList.add('active');
            passwordLength = 18;
            includeUppercase = true;
            includeLowercase = true;
            includeNumbers = true;
            includeSymbols = true;
            useKeywords = true;
            beautifyKeywords = true;
            break;
    }
    
    // Update UI to match preset
    lengthSlider.value = passwordLength;
    lengthValue.textContent = passwordLength;
    uppercaseCheckbox.checked = includeUppercase;
    lowercaseCheckbox.checked = includeLowercase;
    numbersCheckbox.checked = includeNumbers;
    symbolsCheckbox.checked = includeSymbols;
    useKeywordsCheckbox.checked = useKeywords;
    beautifyKeywordsCheckbox.checked = beautifyKeywords;
    keywordsInput.disabled = !useKeywords;
    beautifyKeywordsCheckbox.disabled = !useKeywords;
    
    updateStrengthMeter();
}

// Beautify a keyword (e.g., Ocean -> 0c34n!)
function beautifyKeyword(keyword) {
    if (!keyword) return '';
    let result = keyword;
    
    if (beautifyKeywords) {
        // Randomly replace some characters
        const transformations = [
            { from: 'a', to: '@' },
            { from: 'e', to: '3' },
            { from: 'i', to: '1' },
            { from: 'o', to: '0' },
            { from: 's', to: '$' }
        ];
        
        transformations.forEach(t => {
            if (Math.random() > 0.5) {
                result = result.replace(new RegExp(t.from, 'gi'), t.to);
            }
        });
        
        // Randomly capitalize some letters
        result = result.split('').map(char => {
            if (Math.random() > 0.7 && /[a-z]/i.test(char)) {
                return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
            }
            return char;
        }).join('');
        
        // Add a random symbol at the end if symbols are enabled
        if (includeSymbols && Math.random() > 0.5) {
            result += getRandomChar(symbolChars);
        }
    }
    
    return result;
}

// Generate password
function generatePassword() {
    let charset = '';
    let password = '';
    
    // Build character set based on selected options
    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;
    
    // Handle keywords if enabled
    if (useKeywords && keywords.length > 0) {
        let keywordString = '';
        const maxKeywordLength = Math.floor((passwordLength - keywords.length * 2) / keywords.length); // Reserve space for required chars
        
        // Process each keyword
        keywords.forEach(keyword => {
            const processedKeyword = beautifyKeyword(keyword.slice(0, maxKeywordLength));
            keywordString += processedKeyword;
        });
        
        // Add keyword string to password
        password += keywordString;
        
        // Ensure at least one character from each selected type
        let requiredChars = [];
        if (includeUppercase && !/[A-Z]/.test(password)) requiredChars.push(getRandomChar(uppercaseChars));
        if (includeLowercase && !/[a-z]/.test(password)) requiredChars.push(getRandomChar(lowercaseChars));
        if (includeNumbers && !/[0-9]/.test(password)) requiredChars.push(getRandomChar(numberChars));
        if (includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) requiredChars.push(getRandomChar(symbolChars));
        
        password += requiredChars.join('');
        
        // Fill remaining length with random characters
        while (password.length < passwordLength && charset) {
            password += getRandomChar(charset);
        }
        
        // Trim if too long
        password = password.slice(0, passwordLength);
    } else {
        // No keywords, use standard generation
        let requiredChars = [];
        if (includeUppercase) requiredChars.push(getRandomChar(uppercaseChars));
        if (includeLowercase) requiredChars.push(getRandomChar(lowercaseChars));
        if (includeNumbers) requiredChars.push(getRandomChar(numberChars));
        if (includeSymbols) requiredChars.push(getRandomChar(symbolChars));
        
        password += requiredChars.join('');
        
        while (password.length < passwordLength && charset) {
            password += getRandomChar(charset);
        }
    }
    
    // Shuffle the password to ensure randomness
    password = shuffleString(password);
    
    return password;
}

// Get random character from a string
function getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}

// Shuffle a string
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Update the strength meter based on current settings
function updateStrengthMeter() {
    let strength = 0;
    
    // Calculate strength based on length and character types
    strength += passwordLength * 0.5; // Length factor
    if (includeUppercase) strength += 5;
    if (includeLowercase) strength += 5;
    if (includeNumbers) strength += 5;
    if (includeSymbols) strength += 10;
    if (useKeywords && keywords.length > 0) strength += keywords.length * 5; // Keyword factor
    if (beautifyKeywords && useKeywords) strength += 5; // Beautify factor
    
    // Normalize to 0-100 scale
    let strengthPercentage = Math.min(100, Math.max(0, strength));
    
    // Update the strength meter fill
    strengthFill.style.width = `${strengthPercentage}%`;
    
    // Set color and text based on strength
    if (strengthPercentage < 40) {
        strengthFill.style.backgroundColor = '#ff0066'; // Weak - Red
        securityLevelValue.textContent = 'WEAK';
        securityLevelValue.style.color = '#ff0066';
    } else if (strengthPercentage < 70) {
        strengthFill.style.backgroundColor = '#ffcc00'; // Medium - Yellow
        securityLevelValue.textContent = 'MEDIUM';
        securityLevelValue.style.color = '#ffcc00';
    } else {
        strengthFill.style.backgroundColor = '#00ff9d'; // Strong - Green
        securityLevelValue.textContent = 'STRONG';
        securityLevelValue.style.color = '#00ff9d';
    }
}

// Generate and display password with animation
function generateAndDisplayPassword() {
    const newPassword = generatePassword();
    
    // Choose animation type (typewriter or fade-in)
    const animationType = Math.random() > 0.5 ? 'typewriter' : 'fade';
    
    if (animationType === 'typewriter') {
        // Typewriter effect
        passwordResult.textContent = '';
        passwordResult.classList.add('typewriter-effect');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < newPassword.length) {
                passwordResult.textContent += newPassword.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                passwordResult.classList.remove('typewriter-effect');
            }
        }, 50);
    } else {
        // Fade-in effect
        passwordResult.classList.add('fade-in');
        passwordResult.textContent = newPassword;
        
        setTimeout(() => {
            passwordResult.classList.remove('fade-in');
        }, 500);
    }
    
    updateStrengthMeter();
}

// Copy password to clipboard
copyBtn.addEventListener('click', () => {
    const password = passwordResult.textContent;
    navigator.clipboard.writeText(password).then(() => {
        // Show copy feedback
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = '#00ff9d';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.color = '';
        }, 1500);
    });
});

// Generate button click event
generateBtn.addEventListener('click', generateAndDisplayPassword);

// Initialize the app
function initApp() {
    // Set initial preset
    setPreset('medium');
    
    // Initialize keywords
    updateKeywordsDisplay();
    
    // Generate initial password
    generateAndDisplayPassword();
    
    // Initialize matrix background
    initMatrix();
    
    // Handle window resize for matrix canvas
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);