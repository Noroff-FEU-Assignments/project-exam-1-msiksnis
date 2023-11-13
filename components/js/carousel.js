import { fetchPosts } from "../../js/api.js";

let currentSlide = 0;
let slideInterval;

// This updates the carousels current visible slide and the active state of the dots
const updateCarousel = (slides, dots) => {
  slides.forEach((slide, index) => {
    // If the slide is current slide, adds active class, otherwise remove it
    slide.classList.toggle("active", index === currentSlide);
  });
  dots.forEach((dot, index) => {
    // Adds active class for the dot
    dot.classList.toggle("active", index === currentSlide);
  });
};

// This function is called when a dot is clicked
const goToSlide = (slideIndex, slides, dots) => {
  currentSlide = slideIndex;
  updateCarousel(slides, dots);
  resetInterval(slides, dots);
};

// This function is called when the next button is clicked
const nextSlide = (slides, dots) => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel(slides, dots);
};

// This function is called when the previous button is clicked
const resetInterval = (slides, dots) => {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => nextSlide(slides, dots), 8500);
};

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts()
    .then((posts) => {
      // Select only the newest four posts
      const newestPosts = posts.slice(0, 4);

      const carouselContainer = document.querySelector(".carousel-container");
      const dotsContainer = document.querySelector(".carousel-dots");
      const slides = [];
      const dots = [];

      // Create slides and dots for each of the newest four posts
      newestPosts.forEach((post, index) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        if (index === 0) slide.classList.add("active");

        const slideContent = `
                    <img src="${post.featured_image_url}" alt="${post.title.rendered}">
                    <h3>${post.title.rendered}</h3>
                `;
        slide.innerHTML = slideContent;
        carouselContainer.insertBefore(slide, carouselContainer.firstChild);
        slides.push(slide);

        let dot = document.createElement("span");
        dot.classList.add("carousel-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          goToSlide(index, slides, dots);
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });

      // Adds event listeners to the next and previous buttons
      document.querySelector(".carousel-prev").addEventListener("click", () => {
        goToSlide(
          currentSlide === 0 ? slides.length - 1 : currentSlide - 1,
          slides,
          dots
        );
      });

      document.querySelector(".carousel-next").addEventListener("click", () => {
        goToSlide(
          currentSlide === slides.length - 1 ? 0 : currentSlide + 1,
          slides,
          dots
        );
      });

      // Slaides to the next slide every 8 seconds
      slideInterval = setInterval(() => nextSlide(slides, dots), 8000);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
});
