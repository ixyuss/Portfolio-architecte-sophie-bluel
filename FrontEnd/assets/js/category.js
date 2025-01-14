const apiUrlWorks = "http://localhost:5678/api/works";
const apiUrlCategories = "http://localhost:5678/api/categories";

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch(apiUrlCategories);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        // Pas de console.error, on laisse juste l'erreur sans afficher
    }
}

// Fonction pour afficher les catégories sous forme de boutons
function displayCategories(categories) {
    const categoryMenu = document.querySelector(".category-menu");

    const allButton = document.createElement("button");
    allButton.classList.add("category-btn");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => fetchWorks("all"));
    categoryMenu.appendChild(allButton);

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
        const response = await fetch(apiUrlWorks);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const works = await response.json();
        const filteredWorks = categoryId === "all" 
            ? works 
            : works.filter(work => work.categoryId === parseInt(categoryId));

        displayWorks(filteredWorks);
    } catch (error) {
        // Pas de console.error, on laisse juste l'erreur sans afficher
    }
}

fetchCategories();
