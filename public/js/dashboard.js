document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch("/api/posts");
  const posts = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  if (!posts.length) {
    feed.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${post.image_url}" class="post-img"/>
      <div class="post-content">
        <h4>${post.email}</h4>
        <p>${post.caption}</p>
      </div>
    `;

    feed.appendChild(card);
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
