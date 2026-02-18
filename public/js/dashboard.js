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

    let parentBlock = "";
    if (post.parent_caption) {
      parentBlock = `
        <div style="border-left:3px solid #888;padding-left:10px;margin-bottom:8px;">
          <small>Remix of:</small>
          <p>${post.parent_caption}</p>
        </div>
      `;
    }

    card.innerHTML = `
      ${parentBlock}
      <img src="${post.image_url}" />
      <div class="card-body">
        <strong>${post.email}</strong>
        <p>${post.caption}</p>
        <button onclick="remixPost('${post.id}', '${post.image_url}')">🔁 Remix</button>
      </div>
    `;

    feed.appendChild(card);
  });
}

async function createPost(type = "post", parent_id = null, image_override = null) {
  const token = localStorage.getItem("token");
  if (!token) return;

  const image_url = image_override || document.getElementById("image_url").value;
  const caption = document.getElementById("caption").value;

  await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ image_url, caption, type, parent_id })
  });

  document.getElementById("caption").value = "";
  loadPosts();
}

function remixPost(parent_id, image_url) {
  const caption = prompt("Add remix caption:");
  if (!caption) return;

  document.getElementById("caption").value = caption;
  createPost("remix", parent_id, image_url);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
