import { timeSince } from "../utils/helper-functions.js";
import { fetchPosts } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts()
    .then((posts) => {
      const postsContainer = document.getElementById("posts-container");
      const template = document.querySelector(".post-template");

      posts.slice(3, 7).forEach((post) => {
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
    })
    .catch((error) => console.error("Error fetching posts:", error));
});
