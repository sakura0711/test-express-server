const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');
const bodyParser = require('body-parser');  // 新增這一行

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MariaDB 連線池配置
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sakura0711',
    database: '測試',
    connectionLimit: 5
});




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


// API 路由 - /addStory
app.post('/addStory', async (req, res) => {
    const { _chapter, _title, _content } = req.body;



    try {
        const conn = await pool.getConnection();
        await conn.query(`INSERT INTO 主線章節表 (章節, 標題, 故事內容) VALUES (${_chapter}, "${_title}", "${_content}")`);
        conn.release();

        res.json({ success: true, message: `章節 ${_content} 新增成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;

// entry HTML point
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
