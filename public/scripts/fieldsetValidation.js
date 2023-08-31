
//bootstrap doesn't support fieldset for validation styling so we have to manually do this
document.getElementById('reviewForm').addEventListener('submit', function (e) {
    let form = e.target;
    let selectedRating = form.querySelector('input[name="review[rating]"]:checked');
    let feedbackMessage = document.getElementById('ratingFeedback');  // Get the feedback div
    let fieldset = form.querySelector('.starability-basic');  // Get the fieldset containing the radios

    if (!selectedRating || selectedRating.value === "0") {
        e.preventDefault();

        // Add 'is-invalid' class to the fieldset to show the error
        fieldset.classList.add('is-invalid');

        // Show the error message
        feedbackMessage.style.display = 'block';
    } else {
        // If validation passes, remove the 'is-invalid' class
        fieldset.classList.remove('is-invalid');

        // Hide the error message
        feedbackMessage.style.display = 'none';
    }
});

// Remove the is-invalid class when user chooses a star.
document.querySelectorAll('input[name="review[rating]"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        let ratingFieldset = document.querySelector('.starability-basic');
        ratingFieldset.classList.remove('is-invalid');
    });
});