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
        document.getElementById("image").src = mediaUrl;
        document.getElementById("image").alt = post.title.rendered;
      }
    });
  }

  fetchLatestPosts(post.id);
}

async function fetchLatestPosts(excludePostId) {
  try {
    const response = await fetch(
      `https://www.lovetherain.no/wp-json/wp/v2/posts?per_page=4`
    );
    const posts = await response.json();
    const filteredPosts = posts
      .filter((post) => post.id !== excludePostId)
      .slice(0, 3);
    displayRecommendedPosts(filteredPosts);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
  }
}

function displayRecommendedPosts(posts) {
  const recommendedPostsContainer =
    document.getElementById("recommended-posts");

  posts.forEach((post) => {
    const postTemplate = document
      .querySelector(".rec-post-template")
      .cloneNode(true);
    postTemplate.style.display = "block";

    const postLink = `post.html?slug=${post.slug}`;

    postTemplate.querySelector(".rec-post-link").href = postLink;
    if (post.featured_media) {
      fetchFeaturedMedia(post.featured_media).then((mediaUrl) => {
        if (mediaUrl) {
          postTemplate.querySelector(".rec-post-image").src = mediaUrl;
          postTemplate.querySelector(".rec-post-image").alt =
            post.title.rendered;
        }
      });
    }
    postTemplate.querySelector(".rec-post-title").innerText =
      post.title.rendered;
    postTemplate.querySelector(".rec-post-excerpt").innerHTML =
      post.excerpt.rendered;

    recommendedPostsContainer.appendChild(postTemplate);
  });
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
