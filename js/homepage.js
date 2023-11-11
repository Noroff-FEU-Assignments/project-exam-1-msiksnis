import { fetchPosts } from "./api.js";

function displayPosts(posts) {
  const postsContainer = document.getElementById("posts-container");

  posts.forEach((post) => {
    const postLink = document.createElement("a");
    postLink.href = `post.html?slug=${post.slug}`;
    postLink.className = "post-link";

    const postElement = document.createElement("div");
    postElement.className = "post";

    const postDate = document.createElement("p");
    postDate.className = "post-date";
    postDate.innerText = formatDate(post.date);
    postElement.appendChild(postDate);

    if (post.featured_image_url) {
      const image = document.createElement("img");
      image.src = post.featured_image_url;
      image.alt = post.title.rendered;
      postElement.appendChild(image);
    }

    const postTitle = document.createElement("h3");
    postTitle.innerText = post.title.rendered;
    postElement.appendChild(postTitle);

    const postExcerpt = document.createElement("p");
    postExcerpt.innerHTML = post.excerpt.rendered;
    postElement.appendChild(postExcerpt);
    postLink.appendChild(postElement);
    postsContainer.appendChild(postLink);
  });
}

// Helper function to format the date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchPosts()
    .then((posts) => displayPosts(posts))
    .catch((error) => console.error("Error fetching posts:", error));
});
