import { fetchPosts } from "../../js/api.js";

let currentSlide = 0;
let slideInterval;

// Function to update the carousels current visible slide and the active state of the dots
const updateCarousel = (slides, dots) => {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
};

// Function to go to a specific slide when a dot is clicked
const goToSlide = (slideIndex, slides, dots) => {
  currentSlide = slideIndex;
  updateCarousel(slides, dots);
  resetInterval(slides, dots);
};

// Function to move to the next slide
const nextSlide = (slides, dots) => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel(slides, dots);
};

// Function to reset the interval for automatic slide change
const resetInterval = (slides, dots) => {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => nextSlide(slides, dots), 8500);
};

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts()
    .then((posts) => {
      const carouselContainer = document.querySelector(".carousel-container");
      const dotsContainer = document.querySelector(".carousel-dots");
      const slides = [];
      const dots = [];

      // Creates slides for the first three posts
      posts.slice(0, 3).forEach((post, index) => {
        const postLink = document.createElement("a");
        postLink.href = `post.html?slug=${post.slug}`;
        postLink.className = "carousel-slide";
        if (index === 0) postLink.classList.add("active");

        // Populate slide with content from post
        const slideContent = `
          <img src="${post.featured_image_url}" alt="${post.title.rendered}">
          <h3>${post.title.rendered}</h3>
        `;
        postLink.innerHTML = slideContent;
        carouselContainer.insertBefore(postLink, carouselContainer.firstChild);
        slides.push(postLink);

        let dot = document.createElement("span");
        dot.classList.add("carousel-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index, slides, dots));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });

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

      slideInterval = setInterval(() => nextSlide(slides, dots), 8500);
    })
    .catch((error) => console.error("Error fetching posts:", error));
});
