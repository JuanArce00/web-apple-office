const mysql = require('mysql2/promise');
async function main() {
    const c = await mysql.createConnection({ host: 'localhost', user: 'root', port: 3306 });
    await c.query('CREATE DATABASE IF NOT EXISTS apple_office;');
    await c.end();
    console.log('DB Ready');
}
main();
