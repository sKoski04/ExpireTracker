import * as SQLite from 'expo-sqlite';

let db;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('shelf.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shelf (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shelf_id INTEGER,
      barcode TEXT,
      name TEXT,
      expiration TEXT
    );
  `);

  console.log('Database setup done');
}

export async function insertTestShelf(name) {
  const result = await db.runAsync(
    `INSERT INTO shelf (name) VALUES (?);`,
    [name]
  );
  console.log('Inserted shelf id:', result.lastInsertRowId);
  return result.lastInsertRowId;
}

export async function insertTestItem(shelfId, barcode, name, expiration) {
  const result = await db.runAsync(
    `INSERT INTO item (shelf_id, barcode, name, expiration) VALUES (?, ?, ?, ?);`,
    [shelfId, barcode, name, expiration]
  );
  console.log('Inserted item id:', result.lastInsertRowId);
}

export async function fetchItems() {
  const items = await db.getAllAsync('SELECT * FROM item;');
  console.log('Fetched items:', items);
  return items;
}

export function resetDatabase() {
  db.execAsync(tx => {
    tx.executeSql('DROP TABLE IF EXISTS shelf;');
    tx.executeSql('DROP TABLE IF EXISTS item;');
  }, (error) => console.log('Reset DB error', error),
     () => console.log('Database deleted'));
}


