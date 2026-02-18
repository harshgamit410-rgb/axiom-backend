export default async function (app) {
  app.post("/logout", async (req, reply) => {
    reply.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    return { logout: true };
  });
}
