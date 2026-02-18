const profiles = {};

export function getProfile(userId, email) {
  if (!profiles[userId]) {
    profiles[userId] = {
      id: userId,
      email,
      name: "New User",
      bio: "",
      avatar: ""
    };
  }
  return profiles[userId];
}

export function updateProfile(userId, data) {
  profiles[userId] = { ...profiles[userId], ...data };
  return profiles[userId];
}
