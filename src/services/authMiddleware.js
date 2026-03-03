import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "axiom_dev_secret";

export function verifyToken(request, reply, done) {
  const auth = request.headers.authorization;

  if (!auth) {
    return reply.code(401).send({ error: "No token provided" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded;
    done();
  } catch (err) {
    return reply.code(401).send({ error: "Invalid token" });
  }
}
