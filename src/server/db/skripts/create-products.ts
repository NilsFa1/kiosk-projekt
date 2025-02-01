import {useDatabase} from "nitropack/runtime";
import {Product} from "../../../models/product";
import {PRODUCT_TABLE_NAME} from "./create-product-table";
import {ProductRow,readProducts} from "./read-products";
import {Primitive} from "db0";

export async function insertProducts(products: Product[]) {
  const db = useDatabase();

  const dbProducts = await readProducts();

  //Nur neue Produkte anlegen
  const rows = (await Promise.all(products.map(async p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    image: new Uint8Array(await p.image?.arrayBuffer() ?? []),
    mime: p.image?.type,
    price: p.price,
    category: p.category,
    active: p.active ? 1 : 0,
  }) as ProductRow))).filter(p => !dbProducts.some(dbP => dbP.name === p.name));

  try {
    // SQL für das Einfügen eines Benutzers vorbereiten
    const keys = Object.keys(rows[0]) as (keyof ProductRow)[];
    const questionMarks = keys.map(() => "?").join(", ");
    const insert = db.prepare(`INSERT INTO ${PRODUCT_TABLE_NAME} (${keys.join(",")}) VALUES (${questionMarks})`);

    // Benutzer iterieren und einfügen
      for (const row of rows) {
        await insert.run(...Object.values(row) as Primitive[]);
      }

    console.log('Alle Produkte wurden eingefügt.');
  } catch (err) {
    console.error('Fehler beim Einfügen der Produkte:', err);
  }
}
