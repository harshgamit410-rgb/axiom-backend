import { authGuard } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../store/profile.js";

export default async function (app) {
  app.get("/profile/me", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const profile = getProfile(user.id, user.email);
    return { profile };
  });

  app.put("/profile/me", { preHandler: authGuard }, async (req) => {
    const user = req.user;
    const profile = updateProfile(user.id, req.body);
    return { profile };
  });
}
