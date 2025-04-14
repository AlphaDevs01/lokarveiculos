import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Ajuste para usar a porta fornecida pela Vercel

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware para servir a pasta de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Caminho do "banco de dados"
const veiculosPath = path.resolve(__dirname, "../data/veiculos.json");

// Rota para listar veículos
app.get("/api/veiculos", (req, res) => {
  console.log("Recebida requisição GET em /api/veiculos");
  fs.readFile(veiculosPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo veiculos.json:", err);
      return res.status(500).json({ error: "Erro ao ler os dados do servidor" });
    }
    try {
      const veiculos = JSON.parse(data);
      console.log("Veículos carregados com sucesso:", veiculos); // Log para depuração
      res.json(veiculos);
    } catch (parseError) {
      console.error("Erro ao parsear o arquivo veiculos.json:", parseError);
      res.status(500).json({ error: "Erro ao processar os dados do servidor" });
    }
  });
});

// Rota para adicionar veículo
app.post("/api/veiculos", (req, res) => {
  const novoVeiculo = req.body;
  fs.readFile(veiculosPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao ler os dados" });
    const veiculos = JSON.parse(data);
    novoVeiculo.id = veiculos.length + 1;
    veiculos.push(novoVeiculo);
    fs.writeFile(veiculosPath, JSON.stringify(veiculos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erro ao salvar os dados" });
      res.status(201).json(novoVeiculo);
    });
  });
});

// Rota para excluir veículo
app.delete("/api/veiculos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(veiculosPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao ler os dados" });
    let veiculos = JSON.parse(data);
    veiculos = veiculos.filter((veiculo) => veiculo.id !== id);
    fs.writeFile(veiculosPath, JSON.stringify(veiculos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erro ao salvar os dados" });
      res.status(200).json({ message: "Veículo excluído com sucesso" });
    });
  });
});

// Middleware para lidar com rotas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
