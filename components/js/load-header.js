document.addEventListener("DOMContentLoaded", () => {
  fetch("components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body").insertAdjacentHTML("afterbegin", data);

      // Code related to hamburger menu
      const hamburgerContainer = document.querySelector(".hamburger-container");
      const hamburgerMenu = document.querySelector(".hamburger-menu");
      const navUl = document.querySelector("nav .nav-links");

      hamburgerContainer.addEventListener("click", () => {
        navUl.classList.toggle("show");
        hamburgerMenu.classList.toggle("open");
      });

      // This part of the code is for the search modal
      const searchButton = document.querySelector(".search-btn");
      const closeButton = document.querySelector(".close-btn");
      const modal = document.getElementById("search-modal");
      // const modalContent = document.querySelector(".modal-content");

      if (searchButton) {
        searchButton.addEventListener("click", function () {
          modal.classList.add("active");
        });
      }

      if (closeButton) {
        closeButton.addEventListener("click", function () {
          modal.classList.remove("active");
        });
      }

      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.classList.remove("active");
        }
      });

      function debounce(func, wait, immediate) {
        let timeout;
        return function () {
          const context = this,
            args = arguments;
          const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          const callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      }

      const debouncedSearch = debounce(function () {
        const searchValue = document.getElementById("search-input").value;
        // Implement search functionality here
        console.log("Searching for:", searchValue);
      }, 250);

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.addEventListener("input", debouncedSearch);
      }
    })
    .catch((error) => console.error("Error loading the header:", error));
});

// Scroll event listener
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
