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
    database: 'gameDB',
    connectionLimit: 5
});


/****************************************************
 * 
 *             故事 api [mainchapters]
 * 
 *  ✔️ [get]    /getStory    : get all story data
 *  ✔️ [post]   /addStory    : add one story data
 *  ✔️ [put]    /putStory    : modify story content
 *  ✔️ [Delete] /delStory    : delete one story (use _chapterID)
 * 
 ****************************************************/
//#region 
// API 路由 - /getStory
app.get('/getStory', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM mainchapters');
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
        await conn.query(`INSERT INTO mainchapters (Chapter, Title,StoryContent) VALUES (${_chapter}, "${_title}", "${_content}")`);
        conn.release();

        res.json({ success: true, message: `章節 ${_chapter} 新增成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// API 路由 - /addStory
app.put('/putStory', async (req, res) => {
    const { _chapterID, _chapter, _title, _content } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(` UPDATE mainchapters
                           SET Chapter=${_chapter}, Title= "${_title}", StoryContent= "${_content}"
                           WHERE ChapterID=${_chapterID};`);
        conn.release();

        res.json({ success: true, message: `章節 ${_chapter} 修改成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// API - /delStory
app.delete('/delStory', async (req, res) => {
    const { _chapterID } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(`DELETE FROM mainchapters WHERE ChapterID=${_chapterID};`);
        conn.release();

        res.json({ success: true, message: `章節 ${_chapterID} 刪除成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
//#endregion


/****************************************************
 * 
 *               武器 api [weapons]
 *  
 *  ✔️ [get]    /getWeapons    : get all weapons data
 *  ✔️ [post]   /addWeapons    : add one weapons data
 *  ✔️ [put]    /putWeapons    : modify weapons content
 *  ✔️ [Delete] /delWeapons    : delete one weapons (use _WeaponID)
 * 
 ****************************************************/
//#region 
app.get('/getWeapons', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM weapons');
        conn.release();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addWeapons', async (req, res) => {
    const { _WeaponName, _WeaponType, _WeaponDescription, _WeaponDamage } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(`INSERT INTO weapons 
                         (WeaponName, WeaponType, WeaponDescription, WeaponDamage) 
                         VALUES ("${_WeaponName}", "${_WeaponType}", "${_WeaponDescription}", "${_WeaponDamage}")`);
        conn.release();

        res.json({ success: true, message: `武器 ${_WeaponName} 新增成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/putWeapons', async (req, res) => {
    const { _WeaponID, _WeaponName, _WeaponType, _WeaponDescription, _WeaponDamage } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(` UPDATE weapons
                           SET WeaponName="${_WeaponName}", WeaponType="${_WeaponType}",
                               WeaponDescription="${_WeaponDescription}", WeaponDamage=${_WeaponDamage}
                           WHERE WeaponID=${_WeaponID};`);
        conn.release();

        res.json({ success: true, message: `武器 ${_WeaponID} 修改成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.delete('/delWeapons', async (req, res) => {
    const { _WeaponID } = req.body;
    try {
        const conn = await pool.getConnection();
        await conn.query(`DELETE FROM weapons WHERE WeaponID=${_WeaponID};`);
        conn.release();

        res.json({ success: true, message: `武器 ${_WeaponID} 刪除成功` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
//#endregion

// 啟動伺服器
const PORT = process.env.PORT || 3000;

// entry HTML point
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
