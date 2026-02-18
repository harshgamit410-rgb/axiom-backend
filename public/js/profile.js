const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/";
}

async function loadProfile() {
  const res = await fetch("/api/me", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();

  document.getElementById("email").innerText = data.email;
  document.getElementById("bio").value = data.bio || "";
}

async function saveProfile() {
  const bio = document.getElementById("bio").value;

  await fetch("/api/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ bio })
  });

  alert("Profile updated");
}

async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";

  posts
    .filter(p => p.email === document.getElementById("email").innerText)
    .forEach(post => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="${post.image_url}" width="200"><br>
        <p>${post.caption}</p>
        <hr>
      `;
      container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadProfile();
  await loadPosts();
});
