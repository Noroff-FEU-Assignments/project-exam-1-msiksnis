import { fetchPostBySlug } from "./api.js";

const queryParams = new URLSearchParams(window.location.search);
const postSlug = queryParams.get("slug");
const title = document.querySelector("title");
const mainPostLoader = document.querySelector(".main-post-loader");
const recommendedPostsLoader = document.querySelector(
  ".recommended-posts-loader"
);

function toggleLoader(loader, show) {
  loader.style.display = show ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  toggleLoader(mainPostLoader, true);

  if (postSlug) {
    fetchPostBySlug(postSlug)
      .then((post) => {
        if (post) {
          displayPost(post);
          toggleLoader(mainPostLoader, false);
        } else {
          console.log("No post found for this slug");
          toggleLoader(mainPostLoader, false);
        }
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        toggleLoader(mainPostLoader, false);
      });
  }
});

function displayPost(post) {
  title.textContent = post.title.rendered;
  // Populates the title
  document.querySelector(".post-title").innerText = post.title.rendered;

  // Populates the content
  document.getElementById("post-body").innerHTML = post.content.rendered;

  // Fetches and displays featured image
  if (post.featured_media) {
    fetchFeaturedMedia(post.featured_media).then((mediaUrl) => {
      if (mediaUrl) {
        document.getElementById("image").src = mediaUrl;
        document.getElementById("image").alt = post.title.rendered;
      }
    });
  }

  fetchLatestPosts(post.id)
    .then(displayRecommendedPosts)
    .catch((error) =>
      console.error("Error in fetching/displaying recommended posts:", error)
    );
}

async function fetchLatestPosts(excludePostId) {
  toggleLoader(recommendedPostsLoader, true);
  try {
    const response = await fetch(
      `https://www.lovetherain.no/wp-json/wp/v2/posts?per_page=4`
    );
    const posts = await response.json();
    const filteredPosts = posts
      .filter((post) => post.id !== excludePostId)
      .slice(0, 3);
    return filteredPosts; // Return the filtered posts
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error; // Rethrow the error to be handled by the caller
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

  toggleLoader(recommendedPostsLoader, false);
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
