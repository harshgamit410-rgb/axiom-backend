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
  canvas.width = 300;
  canvas.height = 300;
  ctx.drawImage(video, 0, 0, 300, 300);
}

async function postImage() {
  const token = localStorage.getItem("token");
  const caption = document.getElementById("caption").value;

  console.log("TOKEN:", token);

  if (!token) {
    alert("No token found");
    return;
  }

  const imageData = canvas.toDataURL("image/jpeg", 0.4);

  console.log("Image size:", imageData.length);

  try {
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

    const data = await res.json();

    console.log("Response:", data);

    if (res.ok) {
      alert("Posted successfully");
      window.location.href = "/dashboard.html";
    } else {
      alert("Post failed: " + JSON.stringify(data));
    }

  } catch (err) {
    console.log(err);
    alert("Network error");
  }
}
