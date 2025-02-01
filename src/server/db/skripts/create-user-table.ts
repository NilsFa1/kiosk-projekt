import {useDatabase} from "nitropack/runtime";

import {Benutzer} from "../../../models/Benutzer";

export interface BenutzerRow extends Omit<Benutzer,'isAdmin'>{
  isAdmin: 0 | 1;
}

export const USER_COLUMNS: Record<keyof BenutzerRow, string> = {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
    name: 'TEXT NOT NULL',
    password: 'TEXT NOT NULL',
    isAdmin: 'INTEGER NOT NULL DEFAULT 0',
    openApiToken: 'TEXT',
    openApiUrl: 'TEXT'
};

export const USER_TABLE_NAME = 'users';


export async function createUsersTable() {
  const db = useDatabase();
  try {
      const columnsSql = Object.entries(USER_COLUMNS)
        .map(([colName, colType]) => `${colName} ${colType}`)
        .join(', ');

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS ${USER_TABLE_NAME}
      (
        ${columnsSql}
      );
    `;

    // Ausführen des SQL-Befehls
    await db.exec(createTableSql);

    console.log('Tabelle "users" wurde erstellt (falls sie noch nicht existierte).');
  } catch (err) {
    console.error('Fehler beim Erstellen der Tabelle "users":', err);
  }
}
