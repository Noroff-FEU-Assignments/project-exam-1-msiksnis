import { fetchPosts } from "./api.js";
import { timeSince } from "../utils/helper-functions.js";

let currentPage = 1;
const postsPerPage = 10;

// Function to display posts
function displayAllPosts(posts) {
  const postsContainer = document.querySelector("#all-blog-posts");

  posts.forEach((post) => {
    const postClone = document.querySelector(".post-template").cloneNode(true);
    postClone.style.display = "";

    // Set the content of the postClone based on the post data
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

// Function to load posts
async function loadPosts() {
  try {
    const posts = await fetchPosts(currentPage, postsPerPage);
    displayAllPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Event Listener for Load More button
document.querySelector("#load-more").addEventListener("click", () => {
  currentPage++;
  loadPosts();
});

// Initial load of posts
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});
