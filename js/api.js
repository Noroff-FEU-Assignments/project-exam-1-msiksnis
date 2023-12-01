const BASE_API_URL = "https://www.lovetherain.no/wp-json/wp/v2/";

export async function fetchPosts(page = 1, perPage = 10) {
  try {
    const postsResponse = await fetch(
      `${BASE_API_URL}posts?per_page=${perPage}&page=${page}`
    );
    if (!postsResponse.ok) {
      throw new Error(`HTTP error! Status: ${postsResponse.status}`);
    }
    const posts = await postsResponse.json();

    // Fetching featured images for each post
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        if (post.featured_media) {
          const mediaResponse = await fetch(
            `${BASE_API_URL}media/${post.featured_media}`
          );
          const mediaData = await mediaResponse.json();
          post.featured_image_url = mediaData.source_url;
        }
        return post;
      })
    );

    return postsWithImages;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function fetchStickyPosts() {
  try {
    const response = await fetch(`${BASE_API_URL}posts?sticky=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const stickyPosts = await response.json();

    // Fetching featured images for each sticky post
    const stickyPostsWithImages = await Promise.all(
      stickyPosts.map(async (post) => {
        if (post.featured_media) {
          const mediaResponse = await fetch(
            `${BASE_API_URL}media/${post.featured_media}`
          );
          const mediaData = await mediaResponse.json();
          post.featured_image_url = mediaData.source_url;
        }
        return post;
      })
    );

    return stickyPostsWithImages;
  } catch (error) {
    console.error("Error fetching sticky posts:", error);
    throw error;
  }
}

export async function fetchPostBySlug(slug) {
  try {
    const response = await fetch(`${BASE_API_URL}posts?slug=${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const postData = await response.json();
    return postData.length > 0 ? postData[0] : null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    throw error;
  }
}
