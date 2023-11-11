const BASE_API_URL = "https://www.lovetherain.no/wp-json/wp/v2/";

export async function fetchPosts() {
  try {
    const response = await fetch(`${BASE_API_URL}posts/`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    // Handle error in another way if needed
    throw error;
  }
}
