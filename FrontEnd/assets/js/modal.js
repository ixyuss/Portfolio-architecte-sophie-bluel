const modal = document.getElementById("myModal");
const closeModal = document.getElementsByClassName("close")[0];
const modalOverlay = document.querySelector(".modal-overlay");
const addPhotoModal = document.getElementById("addPhotoModal"); // Deuxième modale
const closeAddPhotoModal = document.getElementsByClassName("close-add-photo")[0];
// Fonction pour ouvrir la modale et afficher l'overlay
openModalLink.onclick = function () {
  modal.style.display = "block";
  modalOverlay.style.display = "block"; // Affiche l'overlay
};

closeModal.onclick = function () {
  modal.style.display = "none"; // Masque la modale
  modalOverlay.style.display = "none"; // Masque l'overlay
};
document.querySelectorAll('.close').forEach(btn => btn.onclick = () => {
  btn.closest('.modal').style.display = 'none';
  modalOverlay.style.display = 'none';
  myModal.style.display = 'none';
});

// Vérification du token pour masquer les catégories si l'utilisateur est connecté
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const categoryMenu = document.querySelector(".category-menu");
  if (token) {
    categoryMenu.style.display = "none";
  } else if (openModalLink) {
    openModalLink.style.display = "none";
  }
});

function displayImages() {
  fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
          const galleryView = document.querySelector(".modal-gallery-view");
          const modalGalleryView = document.querySelector(".modal-gallery-view");

          // Vider les galeries pour éviter tout contenu résiduel
          galleryView.innerHTML = "";
          modalGalleryView.innerHTML = "";

          // Utilisation d'un Set pour éviter les doublons
          const displayedIds = new Set();

          // Filtrer les doublons dans les données
          const uniqueData = data.filter((item) => !displayedIds.has(item.id));

          // Ajout d'images dans les deux galeries
          uniqueData.forEach((item) => {
              displayedIds.add(item.id);

              // Création de l'image pour la galerie principale
              const galleryImgContainer = createImageContainer(item);
              galleryView.appendChild(galleryImgContainer);

          });
      })
      .catch((error) => {
          console.error("Erreur lors de la récupération des images", error);
      });
}

// Fonction utilitaire pour créer un conteneur d'image
function createImageContainer(item) {
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("img-container");
  imgContainer.setAttribute("data-id", item.id); // Ajout de l'attribut data-id
  const imgElement = document.createElement("img");
  imgElement.src = item.imageUrl;
  imgElement.alt = item.name || "Image";
  imgElement.style.width = "76.86px";
  imgElement.style.height = "102.57px";
  imgElement.style.margin = "20px 8px";
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.style.position = "absolute";
  deleteIcon.style.top = "10px";
  deleteIcon.style.right = "10px";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.addEventListener("click", () => deleteImage(item.id));
  imgContainer.appendChild(imgElement);
  imgContainer.appendChild(deleteIcon);
  return imgContainer;
}

function deleteImage(id) {
  // Appel API pour supprimer l'image
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token d'authentification
    },
  })
    .then((response) => {
      if (response.ok) {
        // Supprime toutes les occurrences dans le DOM (galerie principale et modale)
        document.querySelectorAll(`[data-id="${id}"]`).forEach((container) => {
          container.remove();
        });
        // Rafraîchit la galerie principale
        fetchWorks();
      } else {
        console.error("Erreur lors de la suppression de l'image :", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la requête de suppression :", error);
    });
}

function addImageToAllViews(imageData) {
  // Création du conteneur pour l'image
  const imgContainer = createImageContainer(imageData);

  // Ajouter l'image à toutes les galeries (exemple : galerie principale et modale)
  document.querySelectorAll(".gallery-view, .modal-gallery-view").forEach((gallery) => {
    const newImgContainer = imgContainer.cloneNode(true); // Cloner le conteneur pour chaque vue
    gallery.appendChild(newImgContainer);
  });
}

// Fonction pour récupérer les catégories
function fetchCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      const categorySelect = document.getElementById("projectCategory");
      categorySelect.innerHTML = '<option value=""></option>'; // Réinitialiser les options
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories", error);
    });
}

// Appeler la fonction pour afficher les images
displayImages();

// Appeler la fonction pour récupérer les catégories au chargement de la page
fetchCategories();

document.getElementById("addPhotoBtn").addEventListener("click", () => {
  document.getElementById("addPhotoModal").style.display = "block";
});

document.querySelector(".back").addEventListener("click", function () {
  // Fermer la modale d'ajout de photo
  addPhotoModal.style.display = "none";

  // Réinitialiser le formulaire
  addPhotoForm.reset();

  // Supprimer l'aperçu de l'image
  const preview = document.getElementById("imagePreview");
  if (preview) preview.remove();

  // Réafficher la vue "Ajouter une photo" et l'icône
  document.querySelector(".add-photo-view").style.display = "block";
  document.querySelector(".choose-image-btn").style.display = "block";
  document.querySelector(".fa-image").style.display = "inline-block";

  // Réinitialiser la couleur du bouton en gris
  submitButton.classList.remove("btn-vert");
  submitButton.classList.add("btn-gris");
});

document.querySelector(".choose-image-btn").addEventListener("click", () => {
  document.getElementById("projectImage").click();
});

// Sélection des élément
const projectImageInput = document.getElementById("projectImage");
const projectCategorySelect = document.getElementById("projectCategory");
const uploadPlaceholder = document.querySelector(".upload-placeholder");
// Prévisualisation de l'image choisie
projectImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  
  if (file && !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    alert("Seules les images JPG, et PNG sont autorisées.");
    projectImageInput.value = ""; // Réinitialiser le champ
  } else if (file && file.size > 4 * 1024 * 1024) {
    alert("L'image ne doit pas dépasser 4 Mo.");
    projectImageInput.value = ""; // Réinitialiser le champ
  } else if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Supprimer toute prévisualisation précédente
      const existingPreview = document.getElementById("imagePreview");
      if (existingPreview) existingPreview.remove();

      // Ajouter la nouvelle prévisualisation
      const preview = document.createElement("img");
      preview.id = "imagePreview";
      preview.src = e.target.result;
      preview.style.width = "100px";
      preview.style.height = "160px";
      uploadPlaceholder.appendChild(preview);

      // Masquer la vue "Ajouter une photo" et l'icône
      document.querySelector(".add-photo-view").style.display = "none";
      document.querySelector(".choose-image-btn").style.display = "none";
      document.querySelector(".fa-image").style.display = "none";
      document.querySelector(".jpg").style.display = "none";

    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener("DOMContentLoaded", function () {
 
  const projectNameInput = document.getElementById("projectName");
  
  const submitButton = document.querySelector(".Valider-modale");
  const addPhotoButton = document.getElementById("addPhotoBtn");

  // Fonction pour vérifier les champs et changer la classe du bouton
  function checkFormValidity() {
    const imageFile = projectImageInput.files[0];
    const title = projectNameInput.value.trim();
    const category = projectCategorySelect.value;

    if (imageFile && title && category) {
      submitButton.classList.remove("btn-gris");
      submitButton.classList.add("btn-vert");
      submitButton.disabled = false; // Activer le bouton
    } else {
      submitButton.classList.remove("btn-vert");
      submitButton.classList.add("btn-gris");
      submitButton.disabled = true; // Désactiver le bouton
    }
  }

  // Vérification des champs à chaque changement
  projectImageInput.addEventListener("change", checkFormValidity);
  projectNameInput.addEventListener("input", checkFormValidity);
  projectCategorySelect.addEventListener("change", checkFormValidity);

  // Vérification initiale au cas où les champs sont déjà remplis
  checkFormValidity();

  addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    // Vérifier si tous les champs sont remplis
    const imageFile = projectImageInput.files[0];
    const title = projectNameInput.value.trim();
    const category = projectCategorySelect.value;

    if (!imageFile || !title || !category) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    

    // Création du FormData
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("category", category);

    // Envoi des données à l'API
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Projet ajouté avec succès :", data);

        // Ajouter dynamiquement le projet dans la galerie sans réinitialiser
        addProjectToGallery(data);

        // Fermer la modale après l'ajout de l'image
        document.getElementById("addPhotoModal").style.display = "none"; // Ferme la modale

        // Réinitialiser le formulaire et l'aperçu de l'image
        addPhotoForm.reset();
        const preview = document.getElementById("imagePreview");
        if (preview) preview.remove();

        // Réafficher la vue "Ajouter une photo" et l'icône
        document.querySelector(".add-photo-view").style.display = "block";
        document.querySelector(".choose-image-btn").style.display = "block";
        document.querySelector(".fa-image").style.display = "inline-block";

        // Réinitialiser la couleur du bouton en gris
        submitButton.classList.remove("btn-vert");
        submitButton.classList.add("btn-gris");
        modal.style.display = "none";
        // Masquer l'overlay de la modale
        document.querySelector(".modal-overlay").style.display = "none";

        // Actualiser la modale pour inclure la nouvelle image
        displayImages(); // Mettre à jour la modale avec la dernière image ajoutée
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du projet :", error);
        alert("Une erreur est survenue lors de l'ajout du projet.");
      });
  });

  // Fonction pour ajouter un projet à la galerie
  function addProjectToGallery(project) {
    const galleryView = document.querySelector(".gallery");

    // Création du conteneur d'image
    const projectContainer = document.createElement("figure");

    const projectImage = document.createElement("img");
    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;
    projectImage.style.width = "100%"; // Vous pouvez ajuster la taille ici

    const projectTitle = document.createElement("figcaption");
    projectTitle.textContent = project.title;
    projectTitle.style.textAlign = "center";

    // Ajouter l'image et le titre dans le conteneur
    projectContainer.appendChild(projectImage);
    projectContainer.appendChild(projectTitle);

    // Ajouter le conteneur à la galerie sans réinitialiser la galerie
    galleryView.appendChild(projectContainer);
  }
});
