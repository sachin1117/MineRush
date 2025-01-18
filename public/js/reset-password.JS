document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const gmail = urlParams.get('gmail');

    const messageDiv = document.getElementById('message');

    // Check for missing or invalid query parameters
    if (!token || !gmail) {
        messageDiv.textContent = 'Invalid or missing reset link.';
        messageDiv.style.color = 'red';
        return;
    }

    // Show the reset password section
    document.getElementById('resetSection').style.display = 'block';

    // Handle form submission
    document.getElementById('resetForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;

        try {
            const response = await fetch('/forgetpassword/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gmail, token, newPassword }),
            });

            if (response.ok) {
                messageDiv.textContent = 'Password reset successfully!';
                messageDiv.style.color = 'green';
                document.getElementById('resetSection').style.display = 'none';
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
});