document.addEventListener("DOMContentLoaded", () => {
  const BASE_API_URL = "https://www.lovetherain.no/wp-json/wp/v2/";

  async function searchPosts(searchQuery) {
    try {
      const response = await fetch(
        `${BASE_API_URL}posts?search=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error searching for posts:", error);
      displayError("Error occurred while searching for posts.");
    }
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
          if (navUl.classList.contains("show")) {
            navUl.classList.remove("show");
            hamburgerMenu.classList.remove("open");
          }

          // Focus on the search input field when the modal is opened
          const searchInput = document.getElementById("search-input");
          if (searchInput) {
            setTimeout(() => {
              searchInput.focus();
            }, 0); // Using setTimeout to ensure the input field is visible and ready to receive focus.
          }
        });
      }

      if (closeButton) {
        closeButton.addEventListener("click", () => {
          modal.classList.remove("active");
          resetSearchInput();
        });
      }

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("active");
          resetSearchInput();
        }
      });

      // Function to reset the search input field and clear search results
      function resetSearchInput() {
        const searchInput = document.getElementById("search-input");
        const searchResultsContainer = document.querySelector(
          ".search-results-container"
        ); // Replace with your actual results container selector

        // Reset search input
        if (searchInput) {
          searchInput.value = "";
        }

        // Clear search results
        if (searchResultsContainer) {
          searchResultsContainer.innerHTML = "";
        }
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("active")) {
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
        const resultsContainer = document.querySelector(
          ".search-results-container"
        );

        // Check if the container exists
        if (!resultsContainer) {
          console.error("Search results container not found");
          return;
        }

        // Clear previous results
        resultsContainer.innerHTML = "";

        searchResults.forEach((result) => {
          // Create new elements for each result
          const resultDiv = document.createElement("div");
          resultDiv.classList.add("search-result");

          const resultLink = document.createElement("a");
          resultLink.href = `post.html?slug=${result.slug}`;
          resultLink.textContent = result.title.rendered;

          resultDiv.appendChild(resultLink);
          resultsContainer.appendChild(resultDiv);
        });
      }

      const debouncedSearch = debounce(async function () {
        const searchValue = document.getElementById("search-input").value;
        if (searchValue) {
          try {
            const searchResults = await searchPosts(searchValue);
            displaySearchResults(searchResults);
          } catch (error) {
            console.error("Error displaying search results:", error);
            displayError("Error occurred while displaying search results.");
          }
        }
      }, 250);

      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.addEventListener("input", debouncedSearch);
      }
    })
    .catch((error) => {
      console.error("Error loading the header:", error);
      displayError("Error loading the header.");
    });

  function displayError(message = "Oops... Something went wrong.") {
    const errorToast = document.getElementById("error-toast");
    errorToast.textContent = message;
    errorToast.classList.add("active");
    setTimeout(() => {
      errorToast.classList.remove("active");
    }, 3000);
  }

  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});
