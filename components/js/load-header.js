document.addEventListener("DOMContentLoaded", () => {
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
