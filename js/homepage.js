import { fetchStickyPosts } from "./api.js";
import { timeSince } from "../utils/helper-functions.js";
import { displayError } from "../components/js/messages.js";

const loader = document.querySelector(".loader");
const postsContainer = document.getElementById("posts-container");
const template = document.querySelector(".post-template");

function toggleLoader(show) {
  loader.style.display = show ? "block" : "none";
}

function displayPosts(posts) {
  posts.forEach((post) => {
    const postClone = template.cloneNode(true);
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

async function loadStickyPosts() {
  toggleLoader(true);
  try {
    const stickyPosts = await fetchStickyPosts();
    displayPosts(stickyPosts);
  } catch (error) {
    postsContainer.innerHTML = displayError();
  } finally {
    toggleLoader(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadStickyPosts();
});
