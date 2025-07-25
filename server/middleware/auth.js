const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = autenticar;
