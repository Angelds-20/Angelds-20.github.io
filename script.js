document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       CONTACT FORM HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('c-name').value;
            const email = document.getElementById('c-email').value;
            const message = document.getElementById('c-message').value;
            const submitBtn = document.getElementById('btn-submit');

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Send AJAX request to FormSubmit.co
            fetch('https://formsubmit.co/ajax/4N63L@proton.me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Nombre: name,
                    Email: email,
                    Mensaje: message
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al enviar.');
            })
            .then(data => {
                // Success output
                formFeedback.textContent = '¡Mensaje recibido con éxito! Me pondré en contacto contigo pronto.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 5000);
            })
            .catch(error => {
                // Error output
                formFeedback.textContent = 'Hubo un problema al enviar. Por favor escribe directamente a 4N63L@proton.me';
                formFeedback.className = 'form-feedback error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            });
        });
    }
});
