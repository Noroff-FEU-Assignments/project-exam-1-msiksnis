import { fetchPosts } from "./api.js";

function displayPosts(posts) {
  const postsContainer = document.getElementById("posts-container");

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const postTitle = document.createElement("h3");
    postTitle.innerText = post.title.rendered;
    postElement.appendChild(postTitle);

    const postExcerpt = document.createElement("p");
    postExcerpt.innerHTML = post.excerpt.rendered;
    postElement.appendChild(postExcerpt);

    // If you want to include images, you'll need to fetch them separately
    // based on post.featured_media

    postsContainer.appendChild(postElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts()
    .then((posts) => displayPosts(posts))
    .catch((error) => console.error("Error fetching posts:", error));
});
