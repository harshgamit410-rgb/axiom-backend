const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied");
  });

function snap() {
  canvas.style.display = "block";

  // resize to small square to reduce size
  canvas.width = 400;
  canvas.height = 400;

  ctx.drawImage(video, 0, 0, 400, 400);
}

async function postImage() {
  const token = localStorage.getItem("token");
  const caption = document.getElementById("caption").value;

  if (!token) {
    alert("Not logged in");
    return;
  }

  // compress image heavily
  const imageData = canvas.toDataURL("image/jpeg", 0.5);

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      image_url: imageData,
      caption
    })
  });

  if (!res.ok) {
    alert("Post failed");
    return;
  }

  window.location.href = "/dashboard.html";
}
