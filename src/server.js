const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const { promisify } = require('util');


const app = express();
app.use(cors());
const PORT = 3001;

// Parse JSON requests
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
// Create a connection to your MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'ritas',         // Your MySQL user
    password: '123', // Your MySQL password
    database: 'myappdb'
});

db.query = promisify(db.query);

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

app.post('/reservaciones', async (req, res) => {
    const { MesaId, Nombre, Telefono, NumeroPersonas, FechaReservacion, HoraReservacion } = req.body;

    const query = 'INSERT INTO reservaciones (MesaId, Nombre, Telefono, NumeroPersonas, FechaReservacion, HoraReservacion) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        await db.query(query, [MesaId, Nombre, Telefono, NumeroPersonas, FechaReservacion, HoraReservacion]);
        res.json({ success: 'Reservación creada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando la reservación' });
    }
});



app.post('/register', async (req, res) => {
    const { username, password, privilege_level } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            username: username,
            password_hash: hashedPassword,
            privilege_level: privilege_level
        };

        // Save the user in the database
        db.query('INSERT INTO users SET ?', user, (err, result) => {
            if (err) throw err;
            res.send('User registered successfully.');
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get('/users', (req, res) => {
    db.query('SELECT id, username, privilege_level FROM users', (err, results) => {
        if (err) {
            console.error(err); // Imprimir el error en la consola del servidor
            res.status(500).json({ error: "Error fetching users" });
            return;
        }
        res.json(results);
    });
});

app.get('/mesas/status', (req, res) => {
    const fecha = req.query.fecha;
    const hora = req.query.hora;

    // Consulta las reservas para la fecha y hora especificadas
    const query = 'SELECT * FROM reservaciones WHERE FechaReservacion = ? AND HoraReservacion = ?';
    db.query(query, [fecha, hora], (err, result) => {
        if (err) throw err;

        // Devuelve el estado de las mesas
        const mesasReservadas = result.map(reserva => reserva.mesa_id);
        res.json(mesasReservadas);
    });
});

app.post('/mesas', async (req, res) => {
    const { numero, comensales, top, left, forma } = req.body;
    const query = 'INSERT INTO mesas (numero, comensales, top, `left`, forma) VALUES (?, ?, ?, ?, ?)';
    try {
        await db.query(query, [numero, comensales, top, left, forma]);
        res.json({ success: 'Mesa creada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creando la mesa' });
    }
});

app.get('/mesas', (req, res) => {
    db.query('SELECT * FROM mesas', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Error obteniendo las mesas" });
            return;
        }
        res.json(results);
    });
});


app.put('/mesas/:id', (req, res) => {
    const { id } = req.params;
    const { top, left} = req.body;
    const query = 'UPDATE mesas SET top = ?, `left` = ? WHERE id = ?';
    db.query(query, [top, left, id], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error actualizando la mesa' });
            return;
        }
        res.status(200).json({ message: 'Mesa actualizada correctamente' });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

