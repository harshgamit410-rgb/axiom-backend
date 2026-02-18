const tokenCheck = localStorage.getItem("token");
if (!tokenCheck) window.location.href = "/";

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
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "/";
    return;
  }

  const image_url = document.getElementById("image_url").value;
  const caption = document.getElementById("caption").value;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ image_url, caption })
  });

  const data = await res.json();

  if (data.error) {
    alert("Post failed: " + data.error);
    return;
  }

  loadPosts();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
