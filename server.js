import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

const { Pool } = pkg; // Extraindo Pool do pacote pg

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // String de conexão do Neon
  ssl: { rejectUnauthorized: false }, // Necessário para conexões seguras
});

// Rota para listar veículos
app.get("/api/veiculos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM veiculos");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

// Rota para adicionar veículo
app.post("/api/veiculos", async (req, res) => {
  const { name, year, price, image } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO veiculos (name, year, price, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, year, price, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao adicionar veículo:", error);
    res.status(500).json({ error: "Erro ao adicionar veículo" });
  }
});

// Rota para excluir veículo
app.delete("/api/veiculos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM veiculos WHERE id = $1", [id]);
    res.status(200).json({ message: "Veículo excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    res.status(500).json({ error: "Erro ao excluir veículo" });
  }
});

// Middleware para lidar com rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});