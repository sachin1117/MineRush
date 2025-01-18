// Handle reset link request form submission
document.getElementById('resetLinkForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const gmail = document.getElementById('gmail').value;
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = ''; // Clear previous messages

    try {
        const response = await fetch('/forgetpassword/send-reset-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gmail }),
        });

        if (response.ok) {
            const data = await response.json();
            messageDiv.textContent = 'Reset link sent successfully!';
            messageDiv.style.color = 'green';
        } else {
            const errorText = await response.text();
            messageDiv.textContent = `Error: ${errorText}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An unexpected error occurred.';
        messageDiv.style.color = 'red';
    }
});

// Handle password reset form submission
document.getElementById('resetForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById('resetNewPassword').value;
    const token = new URLSearchParams(window.location.search).get('token'); // Get token from URL
    const gmail = new URLSearchParams(window.location.search).get('gmail'); // Get Gmail from URL

    const messageDiv = document.getElementById('message');
    messageDiv.textContent = ''; // Clear previous messages

    try {
        const response = await fetch('/forgetpassword/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gmail, token, newPassword }),
        });

        if (response.ok) {
            const data = await response.json();
            messageDiv.textContent = 'Password reset successfully!';
            messageDiv.style.color = 'green';
        } else {
            const errorText = await response.text();
            messageDiv.textContent = `Error: ${errorText}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An unexpected error occurred.';
        messageDiv.style.color = 'red';
    }
});