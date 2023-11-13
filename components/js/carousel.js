import { fetchPosts } from "../../js/api.js";

let currentSlide = 0;
let slideInterval;

const updateCarousel = (slides, dots) => {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
};

const goToSlide = (slideIndex, slides, dots) => {
  currentSlide = slideIndex;
  updateCarousel(slides, dots);
  resetInterval(slides, dots);
};

const nextSlide = (slides, dots) => {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel(slides, dots);
};

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

      posts.forEach((post, index) => {
        // Create slide
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        if (index === 0) slide.classList.add("active");

        // Populate slide with content from post
        const slideContent = `
                    <img src="${post.featured_image_url}" alt="${post.title.rendered}">
                    <h3>${post.title.rendered}</h3>
                `;
        slide.innerHTML = slideContent;
        carouselContainer.insertBefore(slide, carouselContainer.firstChild);
        slides.push(slide);

        // Create corresponding dot
        let dot = document.createElement("span");
        dot.classList.add("carousel-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          goToSlide(index, slides, dots);
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });

      // Set up navigation arrows
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

      // Initialize auto-play
      slideInterval = setInterval(() => nextSlide(slides, dots), 8000);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
});
