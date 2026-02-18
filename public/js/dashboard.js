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
        <div style="background:#1b263b;padding:10px;margin-bottom:8px;border-radius:8px;">
          <small style="color:#aaa;">🔁 Remixed</small>
          <div style="display:flex;gap:10px;margin-top:6px;">
            <img src="${post.parent_image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;" />
            <div>
              <small style="color:#ccc;">${post.parent_caption || ""}</small>
            </div>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      ${parentBlock}
      <img src="${post.image_url}" />
      <div class="card-body">
        <strong>${post.email}</strong>
        <p>${post.caption}</p>
        <button onclick="remixPost('${post.id}')">🔁 Remix</button>
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
    alert("Post failed: " + JSON.stringify(data));
    return;
  }

  loadPosts();
}

async function remixPost(parentId) {
  const caption = prompt("Add remix caption:");
  if (!caption) return;

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      caption,
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
