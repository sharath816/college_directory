const { Pool } = require('pg');
const pool = new Pool({
    user: 'xyz',
    host: 'localhost',
    database: 'college_directoty',
    password: '',
    port: 5432,
});

module.exports = pool;