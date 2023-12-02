document.addEventListener("DOMContentLoaded", () => {
  const BASE_API_URL = "https://www.lovetherain.no/wp-json/wp/v2/";

  async function searchPosts(searchQuery) {
    const response = await fetch(
      `${BASE_API_URL}posts?search=${encodeURIComponent(searchQuery)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }

  fetch("components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body").insertAdjacentHTML("afterbegin", data);

      const hamburgerContainer = document.querySelector(".hamburger-container");
      const hamburgerMenu = document.querySelector(".hamburger-menu");
      const navUl = document.querySelector("nav .nav-links");

      hamburgerContainer.addEventListener("click", () => {
        navUl.classList.toggle("show");
        hamburgerMenu.classList.toggle("open");
      });

      const searchButton = document.querySelector(".search-btn");
      const closeButton = document.querySelector(".close-btn");
      const modal = document.getElementById("search-modal");

      if (searchButton) {
        searchButton.addEventListener("click", () => {
          modal.classList.add("active");
        });
      }

      if (searchButton) {
        searchButton.addEventListener("click", () => {
          modal.classList.add("active");

          // Close the mobile menu if it's open
          if (navUl.classList.contains("show")) {
            navUl.classList.remove("show");
            hamburgerMenu.classList.remove("open");
          }
        });
      }

      modal.addEventListener("click", (event) => {
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
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (immediate && !timeout) func.apply(context, args);
        };
      }

      function displaySearchResults(searchResults) {
        const resultsContainer = document.querySelector(".modal-content");
        const template = document.querySelector(".search-result-template");

        if (!resultsContainer || !template) {
          console.error("Search result template or container not found");
          return;
        }

        // Clear previous results
        resultsContainer
          .querySelectorAll(".search-result-template:not(:first-child)")
          .forEach((node) => node.remove());

        searchResults.forEach((result) => {
          const clone = template.cloneNode(true);
          clone.style.display = "block";

          const resultElement = clone.querySelector(".search-result");
          if (resultElement) {
            resultElement.textContent = result.title.rendered;
            resultElement.href = `post.html?slug=${result.slug}`;
          }

          resultsContainer.appendChild(clone);
        });
      }

      const debouncedSearch = debounce(async function () {
        const searchValue = document.getElementById("search-input").value;
        if (searchValue) {
          try {
            const searchResults = await searchPosts(searchValue);
            console.log("Search Results:", searchResults);
            displaySearchResults(searchResults);
          } catch (error) {
            console.error("Error searching for posts:", error);
            // Handle errors (e.g., show a message to the user)
          }
        }
      }, 250);

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.addEventListener("input", debouncedSearch);
      }
    })
    .catch((error) => console.error("Error loading the header:", error));
});

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
