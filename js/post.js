import { timeSince } from "../utils/helper-functions.js";
import { fetchPostBySlug } from "./api.js";
import { displayError } from "../components/js/messages.js";

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
          displayError("Error fetching post. Please try again later.");

          toggleLoader(mainPostLoader, false);
        }
      })
      .catch((error) => {
        displayError("Error fetching post. Please try again later.");

        toggleLoader(mainPostLoader, false);
      });
  }

  // To scroll to comments section when comment icon is clicked
  const commentIcon = document.querySelector(".post-opt-icon.comment");
  const commentsSection = document.querySelector(".post-comments");

  if (commentIcon && commentsSection) {
    commentIcon.addEventListener("click", () => {
      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
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
      displayError(
        "Error in fetching/displaying recommended posts. Please try again ."
      )
    );

  fetchComments(post.id);
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
    displayError("Error fetching latest posts. Please try again later.");
    throw error;
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
    displayError("Error fetching featured media. Please try again later.");
    return null;
  }
}

document.querySelector(".share").addEventListener("click", function () {
  // To copy current URL to clipboard
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      const toast = document.getElementById("copy-toast");

      // Shows the toast by adding 'active' class
      toast.classList.add("active");

      // Hides the toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove("active");
      }, 3000);
    })
    .catch((error) => {
      displayError("Error copying link. Please try again later.");
    });
});

// Function to move the Remoji bar up to be right after the main image
function moveRemojiBar() {
  const remojiBar = document.querySelector(".remoji_bar");
  const mainImage = document.getElementById("image");

  if (remojiBar && mainImage) {
    // Inserts the Remoji bar right after the main image
    mainImage.after(remojiBar);
  }
}

// Waits for the dynamic content to be loaded before moving the Remoji bar
const observer = new MutationObserver((mutations, obs) => {
  const remojiBar = document.querySelector(".remoji_bar");
  if (remojiBar) {
    moveRemojiBar();
    obs.disconnect(); // Stops observing after moving the Remoji bar once to avoid infinite loop
  }
});

// Starts observing the post content container
observer.observe(document.getElementById("post-content"), {
  childList: true,
  subtree: true,
});

async function fetchComments(postId) {
  try {
    const response = await fetch(
      `https://www.lovetherain.no/wp-json/wp/v2/comments?post=${postId}`
    );
    const comments = await response.json();
    displayComments(comments);
  } catch (error) {
    displayError("Error fetching comments. Please try again later.");
  }
}

function displayComments(comments) {
  const commentCountElement = document.querySelector(".comment-count");
  commentCountElement.textContent = `${comments.length}`;

  const commentsContainer = document.getElementById("comments-container");
  const commentTemplate = document.querySelector(".comment-template");

  commentsContainer.innerHTML = "";

  comments.forEach((comment) => {
    const clone = commentTemplate.cloneNode(true);
    clone.style.display = "block";

    clone.querySelector(".comment-author-name").textContent =
      comment.author_name;
    clone.querySelector(".comment-time span").textContent = timeSince(
      comment.date
    );
    clone.querySelector(".comment-text").innerHTML = comment.content.rendered;

    commentsContainer.appendChild(clone);
  });
}
