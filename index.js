require('dotenv').config();
const DB = require('./db');
const sound = require('sound-play');
const path = require('path');

async function start() {
    //console.log(process.env.DB_Host);
    /*
    const sql = `INSERT INTO siswa (nama, kelas) VALUES ('Asep','3A')`;
    console.log(sql);
    const res = await DB.insert(sql, true);
    if (res['status']) {
        console.log('insert sukses: ' + res['data']);
    }
    else console.log(res);
    */
    //const hasil = await DB.read('SELECT * FROM siswa');
    //console.log(JSON.stringify(hasil));
    let files = ['nomor-antrian','satu','silahkan-menuju-ke-pelayanan-umum'];    
    let idx = -1;
    while(true) {
        idx++;
        try {
            console.log(files[idx]);
            const filePath = path.join(__dirname, `sound/${files[idx]}.mp3`);
            await sound.play(filePath, 1);
        }
        catch(e) {
            console.error(e);
        }
        if (idx == files.length-1) break;
    }
}

start();
