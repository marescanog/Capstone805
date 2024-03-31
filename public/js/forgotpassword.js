document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('password-reset-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting in the traditional way

        // Hide the form and show the confirmation message
        document.getElementById('forgot-password-form').style.display = 'none';
        document.getElementById('email-sent-confirmation').style.display = 'block';

        // At this point, you should add your JavaScript code to make an fetch call to your server for sending the email.
    });
});