// db.ts
import SQLiteCloud from 'sqlitecloud';

const db = new SQLiteCloud({
  username: 'admin',
  apiKey: 'bZ7ER6EQchMRNPsaLGbXbLbNFvspuuO47bua32jEOJw',
  hostname: 'FurgonEscolar.sqlite.cloud',
  database: 'ninos',
  ssl: true,
});

export default db;
