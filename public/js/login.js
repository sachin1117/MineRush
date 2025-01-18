// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
  
    // Function to handle user login
    async function handleLogin() {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (!username || !password) {
        errorMessage.textContent = "Please enter your username and password.";
        return;
      }
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Redirect to the homepage or dashboard after a successful login
          window.location.href = "/";
        } else {
          errorMessage.textContent = data.error || "Login failed. Please try again.";
        }
      } catch (err) {
        errorMessage.textContent = "Error during login. Please try again.";
        console.error(err);
      }
    }
  
    // Attach event listener to login button
    loginBtn.addEventListener("click", handleLogin);
  
    // Redirect to signup page when the signup button is clicked
    signupBtn.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  });

  function validatePhoneInput(event) {
    const input = event.target;

    // Allow only numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');

    // Show error if the length is not 10 digits
    if (input.value.length > 0 && input.value.length !== 10) {
        input.style.borderColor = "red";
        input.setCustomValidity("Phone number must be exactly 10 digits.");
    } else {
        input.style.borderColor = ""; // Reset border color
        input.setCustomValidity(""); // Clear custom validity
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

