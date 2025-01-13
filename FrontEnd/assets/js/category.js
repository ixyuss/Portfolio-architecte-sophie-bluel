const apiUrlWorks = "http://localhost:5678/api/works";
const apiUrlCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        // Récupération des catégories
        const response = await fetch(apiUrlCategories);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Conversion de la réponse en JSON
        const categories = await response.json();

        // Appel de la fonction pour afficher les catégories
        displayCategories(categories);
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}

// Fonction pour afficher les catégories sous forme de boutons
function displayCategories(categories) {
    const categoryMenu = document.querySelector(".category-menu");

    // Création d'un bouton "Toutes" pour réinitialiser le filtre
    const allButton = document.createElement("button");
    allButton.classList.add("category-btn");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => fetchWorks("all"));
    categoryMenu.appendChild(allButton);

    // Parcours des catégories et création des boutons
    categories.forEach(category => {
        const button = document.createElement("button");
        button.classList.add("category-btn");
        button.textContent = category.name;
        button.addEventListener("click", () => fetchWorks(category.id));
        categoryMenu.appendChild(button);
    });
}

// Fonction pour récupérer et filtrer les travaux selon la catégorie
async function fetchWorks(categoryId = "all") {
    try {
        // Récupération des travaux
        const response = await fetch(apiUrlWorks);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Conversion de la réponse en JSON
        const works = await response.json();

        // Filtrage des travaux selon la catégorie
        const filteredWorks = categoryId === "all" 
            ? works 
            : works.filter(work => work.categoryId === parseInt(categoryId));

        // Appel de la fonction pour afficher les travaux
        displayWorks(filteredWorks);
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error);
    }
}

// Initialisation
fetchCategories();


