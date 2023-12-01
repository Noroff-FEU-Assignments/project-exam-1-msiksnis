export function displayError(message = "Oops... Something went wrong.") {
  const errorToast = document.getElementById("error-toast");
  errorToast.textContent = message;
  errorToast.classList.add("active");
  setTimeout(() => {
    errorToast.classList.remove("active");
  }, 3000); // Error toast disappears after 3 seconds
}
