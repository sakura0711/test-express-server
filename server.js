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

/**
 * test
 */

app.get('/getPlayer', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query(`
        SELECT 
            PlayerUUID, 
            PlayerName, 
            JSON_OBJECT(
                'uuid', WeaponUUID,
                'name', WeaponName,
                'type', WeaponType ,
                'description', WeaponDescription,
                'damage', WeaponDamage
            ) AS 'playerWeapon', 
            JSON_OBJECT(
                'uuid', AttackSkillID,
                'name',attackskills.SkillName,
                'description', attackskills.SkillDescription ,
                'damage', attackskills.SkillDamage
            ) as 'AttackSkill', 
            JSON_OBJECT(
                'uuid', DefenseSkillID,
                'name',defenseskills.SkillName,
                'description', defenseskills.SkillDescription ,
                'damage', defenseskills.SkillDamage
            ) as 'DefenseSkill', 
            JSON_OBJECT(
                'uuid', SupportSkillID,
                'name',supportskills.SkillName,
                'description', supportskills.SkillDescription ,
                'damage', supportskills.SkillDamage
            ) as 'SupportSkill', 
            JSON_OBJECT(
                'uuid', MainChapterID,
                'chapter',mainchapters.Chapter,
                'title', mainchapters.Title,
                'content', mainchapters.StoryContent
            ) as 'MainChapter',
            playerLevel

        FROM 
            gamedb.playerdata

        LEFT join gamedb.weapons ON playerdata.WeaponUUID = weapons.WeaponID
        LEFT join gamedb.attackskills on playerdata.AttackSkillID = attackskills.SkillID
        LEFT join gamedb.defenseskills on playerdata.DefenseSkillID = defenseskills.SkillID
        LEFT join gamedb.supportskills on playerdata.SupportSkillID = supportskills.SkillID
        LEFT join gamedb.mainchapters on playerdata.MainChapterID = mainchapters.ChapterID`);

        // where PlayerUUID = 10000 添加在行尾，可以執行 條件搜尋

        conn.release();
        const result = res.json(rows);
        console.log(result);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




/****************************************************
 * 
 *  攻擊技能 api [attackskills]
 *  /getStory    : get all story data
 *  /addStory    : add one story data
 *  /modifyStory : modify story content
 * 
 ****************************************************/

/****************************************************
 * 
 *  防禦技能 api [defenseskills]
 *  /getStory    : get all story data
 *  /addStory    : add one story data
 *  /modifyStory : modify story content
 * 
 ****************************************************/

/****************************************************
 * 
 *  輔助技能 api [supportskill]
 *  /getStory    : get all story data
 *  /addStory    : add one story data
 *  /modifyStory : modify story content
 * 
 ****************************************************/


// 啟動伺服器
const PORT = process.env.PORT || 3000;

// entry HTML point
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
