document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loginBtn");

  btn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard.html";
      } else {
        msg.innerText = data.error || "Login failed";
      }

    } catch (err) {
      msg.innerText = "Network error";
    }
  };
});
