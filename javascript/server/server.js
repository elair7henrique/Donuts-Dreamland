// ================== IMPORTAÇÕES ==================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config(); // <-- Para usar variáveis .env

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONEXÃO COM MYSQL ==================
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // ex: 'containers-us-west-34.railway.app'
  user: process.env.DB_USER,     // ex: 'root'
  password: process.env.DB_PASS, // senha do banco
  database: process.env.DB_NAME, // nome do banco
  port: process.env.DB_PORT || 3306, // porta padrão do MySQL
  ssl: {
    rejectUnauthorized: true, // necessário para PlanetScale
  },
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("✅ Conexão com MySQL bem-sucedida!");
});

// ================== ROTAS ==================

// 👉 CADASTRAR USUÁRIO
app.post("/cadastro", (req, res) => {
  const { email, numero, senha } = req.body;

  console.log("📩 Dados recebidos:", req.body);

  if (!email || !numero || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const sql = "INSERT INTO usuarios (email, numero, senha) VALUES (?, ?, ?)";
  db.query(sql, [email, numero, senha], (err, result) => {
    if (err) {
      console.error("❌ Erro ao cadastrar usuário:", err);
      return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }

    console.log("✅ Usuário cadastrado com sucesso!");
    res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
  });
});

// 👉 LOGIN
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error("❌ Erro ao consultar banco:", err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (results.length > 0) {
      console.log("✅ Login realizado com sucesso!");
      res.status(200).json({ message: "Login realizado com sucesso!" });
    } else {
      res.status(401).json({ message: "E-mail ou senha incorretos!" });
    }
  });
});

// ================== INICIAR SERVIDOR ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});