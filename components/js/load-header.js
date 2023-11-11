document.addEventListener("DOMContentLoaded", () => {
  fetch("components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("body").insertAdjacentHTML("afterbegin", data);
    })
    .catch((error) => console.error("Error loading the header:", error));
});
