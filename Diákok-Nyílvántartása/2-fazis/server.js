
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'diaknyilvantartas_db',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.use(express.json());
app.get("/", (req, res) => {
    res.send("A JSON szerver működik!");
});
app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`);
});

app.get('/api/osztalyok', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, nev, szak, evfolyam
            FROM osztalyok
            ORDER BY id
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            hiba: 'Adatbázis hiba'
        });
    }
});

app.get('/api/osztalyok/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, nev, szak, evfolyam
            FROM osztalyok
            WHERE id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                hiba: 'Az osztály nem található'
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            hiba: 'Adatbázis hiba'
        });
    }
});
app.get('/api/osztalyok/:id/diakok', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                diakok.id,
                diakok.nev,
                diakok.email,
                osztalyok.id AS osztaly_id,
                osztalyok.nev AS osztaly,
                osztalyok.szak,
                osztalyok.evfolyam
            FROM diakok
            INNER JOIN osztalyok
                ON diakok.osztaly_id = osztalyok.id
            WHERE osztalyok.id = ?
            ORDER BY diakok.nev
        `, [req.params.id]);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            hiba: 'Adatbázis hiba'
        });
    }
});

app.get('/api/diakok', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                diakok.id,
                diakok.nev,
                diakok.email,
                osztalyok.id AS osztaly_id,
                osztalyok.nev AS osztaly,
                osztalyok.szak,
                osztalyok.evfolyam
            FROM diakok
            INNER JOIN osztalyok
                ON diakok.osztaly_id = osztalyok.id
            ORDER BY diakok.id
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            hiba: 'Adatbázis hiba'
        });
    }
});
app.get('/api/diakok/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                diakok.id,
                diakok.nev,
                diakok.email,
                osztalyok.id AS osztaly_id,
                osztalyok.nev AS osztaly,
                osztalyok.szak,
                osztalyok.evfolyam
            FROM diakok
            INNER JOIN osztalyok
                ON diakok.osztaly_id = osztalyok.id
            WHERE diakok.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                hiba: 'A diák nem található'
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            hiba: 'Adatbázis hiba'
        });
    }
});

app.listen(PORT, () => {
    console.log(`A szerver fut: http://localhost:${PORT}`);
});