import {UpdateUserRequestParams} from "../../../models/Benutzer";
import {useDatabase} from "nitropack/runtime";
import {USER_TABLE_NAME} from "./create-user-table";
import {Primitive} from "db0";

function isPrimitive(value: unknown): value is string | number | boolean | null {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

function isUint8Array(value: unknown) {
  return value instanceof Uint8Array;
}

function isPrimitiveOrUint8Array(value: unknown): value is string | number | boolean | null | Uint8Array {
  return isPrimitive(value) || isUint8Array(value);
}

function isPrimitiveArray(value: unknown): value is Primitive[] {
  return Array.isArray(value) && value.every(isPrimitiveOrUint8Array);
}

export async function updateUsers(userInfo: UpdateUserRequestParams) {
  const db = useDatabase();
  try {

    const id = userInfo.id;
    // @ts-ignore
    delete userInfo.id;

    const keys = Object.keys(userInfo) as (keyof UpdateUserRequestParams)[];
    const values = Object.values(userInfo);
    if(!isPrimitiveArray(values)) {
      throw new Error('Invalid values');
    }

    const setPhrase = keys.map(k => `${k} = ?`).join(", ");
    const update = db.prepare(`UPDATE ${USER_TABLE_NAME} SET ${setPhrase} WHERE id = ?`);

    await update.run(...values, id);
  } catch (err) {
    console.error('Fehler beim Updaten von:', err);
  }
}
