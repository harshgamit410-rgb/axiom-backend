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

async function createPost(data) {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.error) {
    alert("Post failed: " + result.error);
    return;
  }

  loadPosts();
}

async function remixPost(parent_id, image_url) {
  const caption = prompt("Add remix caption:");
  if (!caption) return;

  await createPost({
    image_url: image_url,
    caption: caption,
    type: "remix",
    parent_id: parent_id
  });
}

async function normalPost() {
  const image_url = document.getElementById("image_url").value;
  const caption = document.getElementById("caption").value;

  await createPost({
    image_url,
    caption,
    type: "post"
  });

  document.getElementById("caption").value = "";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
