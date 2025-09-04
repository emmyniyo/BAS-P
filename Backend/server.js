import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors()); // <-- Ajoute ceci
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Basile.777', // Mets ton mot de passe MySQL ici
  database: 'gestion_locaux'
});

// Cette route va chercher les vraies salles dans la base
app.get('/api/rooms', (req, res) => {
  db.query('SELECT * FROM gestion_locaux.rooms', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM gestion_locaux.users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// Pour les capteurs
app.get('/api/sensors', (req, res) => {
  db.query('SELECT * FROM gestion_locaux.sensors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Pour les équipements
app.get('/api/equipment', (req, res) => {
  db.query('SELECT * FROM gestion_locaux.equipments', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Pour les alertes
app.get('/api/alerts', (req, res) => {
  db.query('SELECT * FROM gestion_locaux.alerts', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Ajout d'une salle
app.post('/api/rooms', (req, res) => {
  const { name, floor, area } = req.body;
  db.query(
    'INSERT INTO gestion_locaux.rooms (name, floor, area) VALUES (?, ?, ?)',
    [name, floor, area],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, floor, area });
    }
  );
});

// Suppression d'une salle
app.delete('/api/rooms/:id', (req, res) => {
  db.query(
    'DELETE FROM gestion_locaux.rooms WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Modification d'une salle
app.put('/api/rooms/:id', (req, res) => {
  const { name, floor, area } = req.body;
  db.query(
    'UPDATE gestion_locaux.rooms SET name = ?, floor = ?, area = ? WHERE id = ?',
    [name, floor, area, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});


// ---------- SENSORS ----------
app.post('/api/sensors', (req, res) => {
  const { name, type, room_id, minThreshold, maxThreshold } = req.body;
  db.query(
    'INSERT INTO gestion_locaux.sensors (name, type, room_id, minThreshold, maxThreshold) VALUES (?, ?, ?, ?, ?)',
    [name, type, room_id, minThreshold, maxThreshold],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, type, room_id, minThreshold, maxThreshold });
    }
  );
});

app.put('/api/sensors/:id', (req, res) => {
  const { name, type, room_id, minThreshold, maxThreshold } = req.body;
  db.query(
    'UPDATE gestion_locaux.sensors SET name = ?, type = ?, room_id = ?, minThreshold = ?, maxThreshold = ? WHERE id = ?',
    [name, type, room_id, minThreshold, maxThreshold, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/sensors/:id', (req, res) => {
  db.query(
    'DELETE FROM gestion_locaux.sensors WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ---------- EQUIPMENT ----------
app.post('/api/equipment', (req, res) => {
  const { name, type, status, room_id } = req.body;
  db.query(
    'INSERT INTO gestion_locaux.equipments (name, type, status, room_id) VALUES (?, ?, ?, ?)',
    [name, type, status, room_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, type, status, room_id });
    }
  );
});

app.put('/api/equipment/:id', (req, res) => {
  const { name, type, status, room_id } = req.body;
  db.query(
    'UPDATE gestion_locaux.equipments SET name = ?, type = ?, status = ?, room_id = ? WHERE id = ?',
    [name, type, status, room_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/equipment/:id', (req, res) => {
  db.query(
    'DELETE FROM gestion_locaux.equipments WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// ---------- USERS (hash bcrypt) ----------
app.post('/api/users', async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO gestion_locaux.users (username, password, role, email) VALUES (?, ?, ?, ?)',
      [username, hashed, role, email],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, username, role, email });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Si password non fourni => on ne le modifie pas
app.put('/api/users/:id', async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      db.query(
        'UPDATE gestion_locaux.users SET username = ?, password = ?, role = ?, email = ? WHERE id = ?',
        [username, hashed, role, email, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    } else {
      db.query(
        'UPDATE gestion_locaux.users SET username = ?, role = ?, email = ? WHERE id = ?',
        [username, role, email, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        }
      );
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  db.query(
    'DELETE FROM gestion_locaux.users WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.listen(3001, () => console.log('API running on port 3001'));