import express from 'express';
import cors from 'cors';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create vehicles table if it doesn't exist
const createVehiclesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        marca VARCHAR(50) NOT NULL,
        ano INTEGER NOT NULL,
        valor_diaria NUMERIC(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'disponível',
        imagem_url TEXT NOT NULL,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Vehicles table created or already exists');

    // Insert sample data if the table is empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM veiculos');
    if (parseInt(rows[0].count) === 0) {
      const sampleVehicles = [
        {
          nome: 'Toyota Corolla',
          marca: 'Toyota',
          ano: 2022,
          valor_diaria: 150.00,
          status: 'disponível',
          imagem_url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
          descricao: 'Sedan confortável com excelente consumo de combustível.'
        },
        {
          nome: 'Honda Civic',
          marca: 'Honda',
          ano: 2021,
          valor_diaria: 140.00,
          status: 'disponível',
          imagem_url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg',
          descricao: 'Sedan esportivo com design moderno.'
        },
        {
          nome: 'Volkswagen Golf',
          marca: 'Volkswagen',
          ano: 2020,
          valor_diaria: 120.00,
          status: 'indisponível',
          imagem_url: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
          descricao: 'Hatchback compacto com tecnologia de ponta.'
        },
        {
          nome: 'Ford Ranger',
          marca: 'Ford',
          ano: 2023,
          valor_diaria: 200.00,
          status: 'disponível',
          imagem_url: 'https://images.pexels.com/photos/2676330/pexels-photo-2676330.jpeg',
          descricao: 'Picape robusta para trabalho e lazer.'
        },
        {
          nome: 'Jeep Compass',
          marca: 'Jeep',
          ano: 2022,
          valor_diaria: 180.00,
          status: 'disponível',
          imagem_url: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
          descricao: 'SUV com tração 4x4 e interior espaçoso.'
        },
        {
          nome: 'Fiat Strada',
          marca: 'Fiat',
          ano: 2021,
          valor_diaria: 110.00,
          status: 'indisponível',
          imagem_url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
          descricao: 'Picape compacta para uso urbano.'
        }
      ];

      for (const vehicle of sampleVehicles) {
        await pool.query(`
          INSERT INTO veiculos (nome, marca, ano, valor_diaria, status, imagem_url, descricao)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          vehicle.nome,
          vehicle.marca,
          vehicle.ano,
          vehicle.valor_diaria,
          vehicle.status,
          vehicle.imagem_url,
          vehicle.descricao
        ]);
      }
      console.log('Sample vehicles inserted');
    }
  } catch (error) {
    console.error('Error creating vehicles table:', error);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Get all vehicles
app.get('/api/veiculos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM veiculos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

// Get vehicle by ID
app.get('/api/veiculos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM veiculos WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
});

// Add new vehicle (protected)
app.post('/api/veiculos', authenticateToken, async (req, res) => {
  try {
    const { nome, marca, ano, valor_diaria, status, imagem_url, descricao } = req.body;
    
    const { rows } = await pool.query(
      'INSERT INTO veiculos (nome, marca, ano, valor_diaria, status, imagem_url, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nome, marca, ano, valor_diaria, status, imagem_url, descricao]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Erro ao adicionar veículo' });
  }
});

// Update vehicle (protected)
app.put('/api/veiculos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, marca, ano, valor_diaria, status, imagem_url, descricao } = req.body;
    
    const { rows } = await pool.query(
      'UPDATE veiculos SET nome = $1, marca = $2, ano = $3, valor_diaria = $4, status = $5, imagem_url = $6, descricao = $7 WHERE id = $8 RETURNING *',
      [nome, marca, ano, valor_diaria, status, imagem_url, descricao, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
});

// Delete vehicle (protected)
app.delete('/api/veiculos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rowCount } = await pool.query('DELETE FROM veiculos WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    res.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Erro ao excluir veículo' });
  }
});

// Initialize database and start server
(async () => {
  await createVehiclesTable();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Admin credentials: ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  });
})();