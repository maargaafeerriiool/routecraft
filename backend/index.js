const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const port = 5001;

// Configuració de la base de dades MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'RouteCraft',
});

app.use(cors());
app.use(express.json());

// Endpoint per registrar un usuari
app.post('/signup', async (req, res) => {
  try {
    const { nom, correu, contrasenya, confirmPassword } = req.body;

    // Validar camps obligatoris
    if (!nom || !correu || !contrasenya || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validar format del correu electrònic
    if (!validateEmail(correu)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Comprovar si les contrasenyes coincideixen
    if (contrasenya !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Encriptar la contrasenya
    const hashedPassword = await bcrypt.hash(contrasenya, 10);

    // Inserir usuari a la taula 'usuari'
    await pool.execute(
      'INSERT INTO usuari (nom, correu, contrasenya) VALUES (?, ?, ?)',
      [nom, correu, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error details:', error.message);

    // Comprovar si el correu ja existeix
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.status(500).json({ message: 'Error registering user' });
  }
});

// Endpoint per iniciar sessió
app.post('/login', async (req, res) => {
  try {
    const { correu, contrasenya } = req.body;

    // Validar camps obligatoris
    if (!correu || !contrasenya) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Comprovar si l'usuari existeix
    const [rows] = await pool.execute('SELECT * FROM usuari WHERE correu = ?', [correu]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Comprovar la contrasenya
    const isPasswordValid = await bcrypt.compare(contrasenya, user.contrasenya);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, nom: user.nom, correu: user.correu } });
  } catch (error) {
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Ruta de prova
app.get('/', (req, res) => {
  res.send('Welcome to the API for RouteCraft!');
});

// Funció per validar correus electrònics
function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 