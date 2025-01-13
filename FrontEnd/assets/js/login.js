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

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    // J'ai mis event.preventDefault pour empêcher le rechargement de la page
    event.preventDefault();

    // J'ai mis const email pour obtenir la valeur de l'email
    const email = document.getElementById('mail').value;
    // J'ai mis const password pour obtenir la valeur du mot de passe
    const password = document.getElementById('password').value;

    try {
        // J'ai mis const response pour envoyer une requête POST à l'API de connexion
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // J'ai mis body pour envoyer les données de connexion en JSON
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // J'ai mis const data pour récupérer la réponse JSON
            const data = await response.json();
            // J'ai mis localStorage.setItem pour stocker le token dans le localStorage
            localStorage.setItem('token', data.token);
            // J'ai mis window.location.href pour rediriger vers la page index.html
            window.location.href = 'index.html';
        } else {
            // J'ai mis document.getElementById pour afficher un message d'erreur
            document.getElementById('error-message').textContent = 'Erreur de connexion. Veuillez vérifier vos identifiants.';
        }
    } catch (error) {
        // J'ai mis console.error pour afficher l'erreur dans la console
        console.error('Erreur:', error);
        // J'ai mis document.getElementById pour afficher un message d'erreur
        document.getElementById('error-message').textContent = 'Une erreur est survenue. Veuillez réessayer.';
    }
});
