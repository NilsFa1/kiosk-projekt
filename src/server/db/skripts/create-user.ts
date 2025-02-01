import {useDatabase} from "nitropack/runtime";
import {Benutzer} from "../../../models/Benutzer";
import * as bcrypt from 'bcrypt';

export async function insertUsers(users: Benutzer[]) {
  const db = useDatabase();
  try {
    // SQL für das Einfügen eines Benutzers vorbereiten
    const insert = db.prepare(`INSERT INTO users (name, password,isAdmin) VALUES (?, ?, ?)`);

    // Benutzer iterieren und einfügen
      for (const user of users) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
        await insert.run(user.name, hashedPassword ,user.isAdmin ? 1 : 0);
        console.log(`Benutzer "${user.name}" eingefügt.`);
      }

    console.log('Alle Benutzer wurden eingefügt.');
  } catch (err) {
    console.error('Fehler beim Einfügen der Benutzer:', err);
  }
}
