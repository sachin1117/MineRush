function validatePhoneInput(event) {
    const input = event.target;
    // Remove any non-digit characters
    input.value = input.value.replace(/\D/g, '');

    // Limit input to exactly 10 digits
    if (input.value.length > 10) {
        input.value = input.value.slice(0, 10);
    }
}

async function handleSignup(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const phoneNumber = document.getElementById('phone_number').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // Ensure phone number is exactly 10 digits
    if (phoneNumber.length !== 10) {
        alert('Phone number must be exactly 10 digits.');
        return;
    }

    // Ensure email is provided
    if (!email) {
        alert('Please provide a valid email address.');
        return;
    }

    // Send signup request
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phoneNumber, password, email })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Show success message
            window.location.href = '/login'; // Redirect to login page
        } else {
            alert(result.error); // Show error message
        }
    } catch (error) {
        alert('An error occurred during signup. Please try again later.');
        console.error(error); // Log error for debugging
    }
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');
    
    // Toggle the password field type based on the checkbox state
    if (showPasswordCheckbox.checked) {
        passwordField.type = 'text';  // Show password
    } else {
        passwordField.type = 'password';  // Hide password
    }
}
function validateEmailInput(event) {
    const emailInput = event.target;
    const emailError = document.querySelector('.email-error-message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format regex
    
    if (!emailRegex.test(emailInput.value)) {
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
}
function validatePhoneInput(event) {
    const input = event.target;
    const errorMessage = document.querySelector('.phone-error-message');

    // Allow only numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');

    // Show error if the length exceeds 10 or is incomplete
    if (input.value.length !== 10) {
        errorMessage.textContent = "Phone number must be exactly 10 digits.";
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
}