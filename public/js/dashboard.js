const API = "";

const token = localStorage.getItem("token");
if (!token) window.location.href = "/";

async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${post.image_url}" />
      <div class="card-body">
        <strong>${post.email}</strong>
        <p>${post.caption}</p>
      </div>
    `;
    feed.appendChild(card);
  });
}

async function createPost() {
  const image_url = document.getElementById("image_url").value;
  const caption = document.getElementById("caption").value;

  await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ image_url, caption })
  });

  loadPosts();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
