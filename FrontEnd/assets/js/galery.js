const apiUrl = "http://localhost:5678/api/works";

// J'ai mis une fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    try {
        // J'ai mis la récupération des données depuis l'API
        const response = await fetch(apiUrl);

        // J'ai mis la vérification si la réponse est correcte
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // J'ai mis la conversion de la réponse en JSON
        const works = await response.json();

        // J'ai mis l'appel de la fonction pour afficher les travaux
        displayWorks(works);
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error);
    }
}

// J'ai mis une fonction pour afficher les travaux dans la galerie
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");

    // J'ai mis la réinitialisation de la galerie pour éviter les doublons
    gallery.innerHTML = "";

    // J'ai mis la vérification que les données sont présentes
    if (Array.isArray(works) && works.length > 0) {
        // J'ai mis le parcours de chaque travail pour créer les éléments HTML
        works.forEach(work => {
            // J'ai mis la création de l'élément figure
            const figure = document.createElement("figure");

            // J'ai mis la création de l'image
            const img = document.createElement("img");
            img.src = work.imageUrl;  // J'ai mis l'utilisation de l'URL de l'image depuis l'API
            img.alt = work.title;  // J'ai mis l'utilisation du titre pour l'attribut alt

            // J'ai mis la création de la légende
            const caption = document.createElement("figcaption");
            caption.textContent = work.title;  // J'ai mis le titre de l'image

            // J'ai mis l'ajout de l'image et de la légende à la figure
            figure.appendChild(img);
            figure.appendChild(caption);

            // J'ai mis l'ajout de la figure à la galerie
            gallery.appendChild(figure);
        });
    } else {
        console.warn("Aucun travail trouvé ou réponse incorrecte.");
    }
}

// J'ai mis l'appel de la fonction fetchWorks pour démarrer
fetchWorks();

// Vérification du token pour afficher le mode édition
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const modeEditionBar = document.getElementById("mode-edition-bar");
  
    if (token) {
      modeEditionBar.style.display = "block"; // Affiche la barre de mode édition
    } else {
      modeEditionBar.style.display = "none"; // Masque la barre si pas connecté
    }
  });
  
  // Ouvrir la modale en cliquant sur le mode édition
  document.getElementById("mode-edition-bar").addEventListener("click", () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      document.getElementById("myModal").style.display = "block"; // Affiche la modale
    } else {
      alert("Vous devez être connecté pour accéder à cette fonctionnalité !");
    }
  });
  