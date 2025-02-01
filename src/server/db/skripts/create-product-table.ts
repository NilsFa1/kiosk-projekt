import {useDatabase} from "nitropack/runtime";
import {ProductRow} from "./read-products";

export const PRODUCT_COLUMNS: Record<keyof ProductRow, string> = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT NOT NULL',
  description: 'TEXT',
  image: 'BLOB',
  mime: 'TEXT',
  price: 'REAL',
  category: 'TEXT',
  active: 'BOOLEAN'
};

export const PRODUCT_TABLE_NAME = 'products';

export async function createProductsTable() {
  const db = useDatabase();
  try {
    // SQL-String für alle Spalten erstellen
    const columnsSql = Object.entries(PRODUCT_COLUMNS)
      .map(([colName, colType]) => `${colName} ${colType}`)
      .join(', ');

    // Tabelle nur erstellen, falls sie noch nicht existiert
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS ${PRODUCT_TABLE_NAME}
      (
        ${columnsSql}
      );
    `;

    await db.exec(createTableSql);
    console.log('Tabelle "products" wurde (ggf.) neu erstellt oder existiert bereits.');

  } catch (err) {
    console.error('Fehler beim Erstellen der Tabelle "products":', err);
    throw err;
  }
}
