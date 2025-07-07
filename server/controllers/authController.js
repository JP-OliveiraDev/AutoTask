const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  const { nome, email, senha } = req.body;

  try {
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ error: "E-mail já cadastrado" });

    const hash = await bcrypt.hash(senha, 10);
    const novoUser = new User({ nome, email, senha: hash });
    await novoUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro no registro" });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    console.log("Tentando login:", email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error("Erro interno no login:", error);
    res.status(500).json({ error: "Erro no login" });
  }
}

module.exports = { register, login };