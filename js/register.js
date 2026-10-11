const form = document.getElementById("registerForm");

form.addEventListener("submit", function(event) {

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const mobileError = document.getElementById("mobileError");

    nameError.textContent = "";
    emailError.textContent = "";
    mobileError.textContent = "";

    // Name validation
    if (name.length < 3) {
        nameError.textContent = "Name must contain at least 3 characters.";
        valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email.";
        valid = false;
    }

    // Mobile validation
    const mobilePattern = /^[6-9][0-9]{9}$/;

    if (!mobilePattern.test(mobile)) {
        mobileError.textContent =
            "Enter a valid 10-digit mobile number.";
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
    }

});