import * as SQLite from 'expo-sqlite';

let db;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('shelf.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS shelf (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shelf_id INTEGER NOT NULL,
      barcode TEXT,
      name TEXT,
      expiration TEXT,
      FOREIGN KEY (shelf_id) REFERENCES shelf(id)
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

export async function fetchShelves() {
  try {
    const shelves = await db.getAllAsync('SELECT * FROM shelf;');
    console.log('Fetched shelves:', shelves);
    return shelves;
  } catch (error) {
    console.error('Error fetching shelves:', error);
    throw error;
  }
}

export async function insertTestItem(shelfId, barcode, name, expiration) {
  const result = await db.runAsync(
    `INSERT INTO item (shelf_id, barcode, name, expiration) VALUES (?, ?, ?, ?);`,
    [shelfId, barcode, name, expiration]
  );
  console.log('Inserted item id:', result.lastInsertRowId);
  return result.lastInsertRowId;
}

export async function saveProduct(barcode, name, expirationDate, shelfId = 1) {
  try {
    const itemId = await insertTestItem(shelfId, barcode, name, expirationDate);
    console.log('Product saved with ID:', itemId);
    return itemId;
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
}

export async function fetchItems() {
  const items = await db.getAllAsync('SELECT * FROM item;');
  console.log('Fetched items:', items);
  return items;
}

export async function getProductByBarcode(barcode) {
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM item WHERE barcode = ? LIMIT 1;',
      [barcode]
    );
    if (result) {
      console.log('Product found with barcode:', barcode, result);
      return result;
    }
    console.log('No product found with barcode:', barcode);
    return null;
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    throw error;
  }
}

export async function getItemsByShelf(shelfId) {
  try {
    const items = await db.getAllAsync(
      'SELECT * FROM item WHERE shelf_id = ? ORDER BY expiration ASC;',
      [shelfId]
    );
    console.log(`Fetched ${items.length} items for shelf ${shelfId}`, items);
    return items;
  } catch (error) {
    console.error('Error fetching items by shelf:', error);
    throw error;
  }
}

export async function deleteItem(itemId) {
  try {
    const result = await db.runAsync(
      'DELETE FROM item WHERE id = ?;',
      [itemId]
    );
    console.log('✓ Item deleted with ID:', itemId);
    return result;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

export function resetDatabase() {
  db.execAsync(tx => {
    tx.executeSql('DROP TABLE IF EXISTS shelf;');
    tx.executeSql('DROP TABLE IF EXISTS item;');
  }, (error) => console.log('Reset DB error', error),
     () => console.log('Database deleted'));
}


