document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch("/api/protected", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();
  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
