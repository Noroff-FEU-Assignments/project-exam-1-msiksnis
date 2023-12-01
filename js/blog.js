import { fetchPosts } from "./api.js";
import { timeSince } from "../utils/helper-functions.js";
import { displayError } from "../components/js/messages.js";

const loader = document.querySelector(".loader");

let currentPage = 1;
const postsPerPage = 10;

function toggleLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function displayAllPosts(posts) {
  const postsContainer = document.querySelector("#all-blog-posts");

  posts.forEach((post) => {
    const postClone = document.querySelector(".post-template").cloneNode(true);
    postClone.style.display = "";

    const postImage = postClone.querySelector(".post-image");
    postImage.src = post.featured_image_url;
    postImage.alt = post.title.rendered;

    const postDate = postClone.querySelector(".post-date");
    postDate.textContent = timeSince(post.date);

    const postTitle = postClone.querySelector(".post-title");
    postTitle.textContent = post.title.rendered;

    const postExcerpt = postClone.querySelector(".post-excerpt");
    postExcerpt.innerHTML = post.excerpt.rendered;

    const postLink = document.createElement("a");
    postLink.href = `post.html?slug=${post.slug}`;
    postLink.appendChild(postClone);

    postsContainer.appendChild(postLink);
  });
}

async function loadPosts() {
  toggleLoader(true);
  try {
    const posts = await fetchPosts(currentPage, postsPerPage);
    displayAllPosts(posts);

    // Disables the "Load More" button if there are no more posts to load
    if (posts.length < postsPerPage) {
      const loadMoreButton = document.querySelector("#load-more");
      loadMoreButton.disabled = true;
      loadMoreButton.classList.add("disabled");
    }
  } catch (error) {
    displayError("Error loading posts. Please try again.");
  } finally {
    toggleLoader(false);
  }
}

document.querySelector("#load-more").addEventListener("click", () => {
  currentPage++;
  loadPosts();
});

document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
