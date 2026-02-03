import * as SQLite from 'expo-sqlite';

let db;

async function ensureDb() {
  if (!db) await initDatabase();
}

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('shelf.db');

  // Run statements separately to avoid multi-statement execution issues
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`CREATE TABLE IF NOT EXISTS shelf (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    productCount INTEGER DEFAULT 0
  );`);

  await db.execAsync(`CREATE TABLE IF NOT EXISTS item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shelf_id INTEGER NOT NULL,
    barcode TEXT,
    name TEXT,
    expiration TEXT,
    productCount INTEGER DEFAULT 0,
    FOREIGN KEY (shelf_id) REFERENCES shelf(id)
  );`);

  console.log('Database setup done');
}

export async function insertTestShelf(name) {
  await ensureDb();
  const result = await db.runAsync(
    `INSERT INTO shelf (name) VALUES (?);`,
    [name]
  );
  console.log('Inserted shelf id:', result.lastInsertRowId);
  return result.lastInsertRowId;
}

export async function fetchShelves() {
  try {
    await ensureDb();
    const shelves = await db.getAllAsync('SELECT * FROM shelf;');
    console.log('Fetched shelves:', shelves);
    return shelves;
  } catch (error) {
    console.error('Error fetching shelves:', error);
    // If table missing, try to initialize DB and retry once
    if (String(error).includes('no such table')) {
      await initDatabase();
      return db.getAllAsync('SELECT * FROM shelf;');
    }
    throw error;
  }
}

export async function insertTestItem(shelfId, barcode, name, expiration) {
  await ensureDb();
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
     await updateProductCount(shelfId, 1);
    return itemId;
   
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
}

export async function fetchItems() {
  await ensureDb();
  const items = await db.getAllAsync('SELECT * FROM item;');
  console.log('Fetched items:', items);
  return items;
}

export async function getProductByBarcode(barcode) {
  try {
    await ensureDb();
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
    if (String(error).includes('no such table')) {
      // Ensure tables exist and return null (no product)
      await initDatabase();
      return null;
    }
    throw error;
  }
}

export async function getItemsByShelf(shelfId) {
  try {
    await ensureDb();
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
    await ensureDb();
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
  if (!db) {
    console.log('No database to reset');
    return;
  }
  db.execAsync(tx => {
    tx.executeSql('DROP TABLE IF EXISTS shelf;');
    tx.executeSql('DROP TABLE IF EXISTS item;');
  }, (error) => console.log('Reset DB error', error),
     () => console.log('Database deleted'));
}

export async function updateProductCount(shelfId, count) {
  await ensureDb();
  await db.runAsync(`UPDATE shelf SET productCount = productCount + ? WHERE id = ?`, [count, shelfId]);
}

export async function addItemToShelf(shelfId) {
  await ensureDb();
  await db.runAsync(`INSERT INTO item (shelf_id) VALUES (?)`, [shelfId]);
  await updateProductCount(shelfId, 1);
}

export async function removeItemFromShelf(shelfId) {
  await ensureDb();
  await db.runAsync(`DELETE FROM item WHERE shelf_id = ?`, [shelfId]);
  await updateProductCount(shelfId, -1);
}


