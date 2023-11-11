import { fetchPostBySlug } from "./api.js";

const queryParams = new URLSearchParams(window.location.search);
const postSlug = queryParams.get("slug");

document.addEventListener("DOMContentLoaded", () => {
  if (postSlug) {
    fetchPostBySlug(postSlug)
      .then((post) => {
        if (post) {
          displayPost(post);
        } else {
          console.log("No post found for this slug");
          // Handle the case where no post is found
        }
      })
      .catch((error) => console.error("Error fetching post:", error));
  }
});

function displayPost(post) {
  const postContent = document.getElementById("post-content");

  const postTitle = document.createElement("h1");
  postTitle.innerText = post.title.rendered;
  postContent.appendChild(postTitle);

  // ... Create and append other post elements like content, date, image ...

  // If you want to display the featured image
  if (post.featured_media) {
    // Fetch and display the image as in the fetchPosts function
  }
}
