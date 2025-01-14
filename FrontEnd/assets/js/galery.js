const apiUrl = "http://localhost:5678/api/works";

// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const works = await response.json();
        displayWorks(works);
    } catch (error) {
        // Pas d'affichage d'erreur
    }
}

// Fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");

    if (!gallery) {
        return;
    }

    gallery.innerHTML = ""; // Réinitialisation de la galerie pour éviter les doublons

    if (Array.isArray(works) && works.length > 0) {
        works.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = work.imageUrl;  // Utilisation de l'URL de l'image depuis l'API
            img.alt = work.title;     // Utilisation du titre pour l'attribut alt

            const caption = document.createElement("figcaption");
            caption.textContent = work.title; // Titre de l'image

            figure.appendChild(img);
            figure.appendChild(caption);
            gallery.appendChild(figure);
        });
    }
}

// Fonction pour vérifier le token et afficher le mode édition
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const modeEditionBar = document.getElementById("mode-edition-bar");

    if (modeEditionBar) {
        modeEditionBar.style.display = token ? "block" : "none"; // Affiche ou masque la barre de mode édition selon le token
    }

    // Ouvrir la modale en cliquant sur la barre de mode édition
    const modeEditionBarClick = document.getElementById("mode-edition-bar");
    if (modeEditionBarClick) {
        modeEditionBarClick.addEventListener("click", () => {
            if (token) {
                document.getElementById("myModal").style.display = "block"; // Affiche la modale
            } else {
                alert("Vous devez être connecté pour accéder à cette fonctionnalité !");
            }
        });
    }
});

// Appel de la fonction fetchWorks pour récupérer et afficher les travaux dès que le DOM est prêt
fetchWorks();
