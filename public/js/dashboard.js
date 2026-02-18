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

    let remixButton = "";
    if (post.type !== "remix") {
      remixButton = `<button onclick="remixPost('${post.id}')">🔁 Remix</button>`;
    }

    card.innerHTML = `
      <img src="${post.image_url}" />
      <div class="card-body">
        <strong>${post.email}</strong>
        <p>${post.caption}</p>
        ${remixButton}
      </div>
    `;

    feed.appendChild(card);
  });
}

async function createPost() {
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
  if (!res.ok) {
    alert("Post failed: " + (data.error || "Unknown error"));
    return;
  }

  loadPosts();
}

async function remixPost(parentId) {
  const caption = prompt("Add remix caption:");
  if (!caption) return;

  const token = localStorage.getItem("token");

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      image_url: "https://picsum.photos/300",
      caption,
      type: "remix",
      parent_id: parentId
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Post failed: " + (data.error || "Unknown error"));
    return;
  }

  loadPosts();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
