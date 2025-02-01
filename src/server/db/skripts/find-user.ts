import {Benutzer} from "../../../models/Benutzer";
import {useDatabase} from "nitropack/runtime";
import {BenutzerRow,USER_COLUMNS} from "./create-user-table";

const UserColumnsKeys = Object.keys(USER_COLUMNS) as (keyof BenutzerRow)[];

export async function findUserByName(name: string): Promise<Benutzer | null> {
  const db = useDatabase();
  try {
    // SQL für das Finden eines Benutzers vorbereiten
    const find = db.prepare(`SELECT ${UserColumnsKeys.join(",")} FROM users WHERE name = ?`);

    // Benutzer suchen
    const user = (await find.get(name)) as BenutzerRow | undefined;

    if (user) {
    return {
        ...user,
        isAdmin: user.isAdmin === 1,
      } as Benutzer;
    } else {
      console.log(`Kein Benutzer mit dem Namen "${name}" gefunden.`);
      return null;
    }
  } catch (err) {
    console.error('Fehler beim Suchen des Benutzers:', err);
    return null;
  }
}
