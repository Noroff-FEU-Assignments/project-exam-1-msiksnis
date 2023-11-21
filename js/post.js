import { fetchPostBySlug } from "./api.js";

const queryParams = new URLSearchParams(window.location.search);
const postSlug = queryParams.get("slug");
const title = document.querySelector("title");

document.addEventListener("DOMContentLoaded", () => {
  if (postSlug) {
    fetchPostBySlug(postSlug)
      .then((post) => {
        if (post) {
          displayPost(post);
        } else {
          console.log("No post found for this slug");
          // Add error handling for the case when no post is found
        }
      })
      .catch((error) => console.error("Error fetching post:", error));
  }
});

function displayPost(post) {
  title.textContent = post.title.rendered;
  // Populate the title
  document.querySelector(".post-title").innerText = post.title.rendered;

  // Populate the content
  document.getElementById("post-body").innerHTML = post.content.rendered;

  // Fetch and display the featured image
  if (post.featured_media) {
    fetchFeaturedMedia(post.featured_media).then((mediaUrl) => {
      if (mediaUrl) {
        document.getElementById("post-image").src = mediaUrl;
        document.getElementById("post-image").alt = post.title.rendered;
      }
    });
  }
}

async function fetchFeaturedMedia(mediaId) {
  try {
    const response = await fetch(
      `https://www.lovetherain.no/wp-json/wp/v2/media/${mediaId}`
    );
    const media = await response.json();
    return media.source_url;
  } catch (error) {
    console.error("Error fetching featured media:", error);
    return null;
  }
}
