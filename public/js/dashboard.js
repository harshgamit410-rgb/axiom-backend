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

    let parentBlock = "";
    if (post.type === "remix" && post.parent_image) {
      parentBlock = `
        <div style="border:1px solid #444; padding:5px; margin-bottom:5px;">
          <small>Remix of:</small>
          <img src="${post.parent_image}" style="width:100%;max-height:150px;object-fit:cover;">
          <p style="font-size:12px;">${post.parent_caption}</p>
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

async function remixPost(parentId, parentImage) {

  const caption = prompt("Add remix caption:");
  if (!caption) return;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      image_url: parentImage,   // 🔥 IMPORTANT FIX
      caption: caption,
      type: "remix",
      parent_id: parentId
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Remix failed: " + JSON.stringify(data));
    return;
  }

  loadPosts();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadPosts();
