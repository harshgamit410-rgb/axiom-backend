export function debugRoute(app) {
  app.get("/__version", async () => {
    return { version: "PROFILE_BUILD_V1" };
  });
}
