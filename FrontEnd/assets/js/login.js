document.addEventListener('DOMContentLoaded', function() {
    // J'ai mis const token pour récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    // J'ai mis const loginLink pour obtenir l'élément avec l'ID 'login-link'
    const loginLink = document.getElementById('login-link');

    if (token) {
        // J'ai mis loginLink.innerHTML pour changer le lien de connexion en lien de déconnexion
        loginLink.innerHTML = '<a href="#" id="logout-link">logout</a>';

        // J'ai mis un écouteur d'événement pour le lien de déconnexion
        document.getElementById('logout-link').addEventListener('click', function() {
            // J'ai mis localStorage.removeItem pour supprimer le token
            localStorage.removeItem('token');
            // J'ai mis window.location.href pour rediriger vers la page login.html
            window.location.href = 'login.html';
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('mail').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                } else {
                    document.getElementById('error-message').textContent = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
                }
            } catch (error) {
                console.error('Erreur:', error);
                document.getElementById('error-message').textContent = 'Une erreur est survenue. Veuillez réessayer.';
            }
        });
    } else {
        
    }
});
