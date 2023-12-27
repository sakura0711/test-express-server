const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();

// MariaDB 連線池配置
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sakura0711',
    database: '測試',
    connectionLimit: 5
});

app.use(cors());

// API 路由 - /getStory
app.get('/getStory', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM 主線章節表');
        conn.release();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});



// 啟動伺服器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
