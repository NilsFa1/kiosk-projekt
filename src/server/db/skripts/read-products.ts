import {ApiProduct, Product} from "../../../models/product";
import {useDatabase} from "nitropack/runtime";
import {blobToDataUrl, uint8ArrayToBlob} from "../../utils/blobToBase64";
import {PRODUCT_COLUMNS} from "./create-product-table";


export interface ProductRow extends Omit<Product, 'active' | 'image'> {
  active: 0 | 1;
  image: Uint8Array | null | undefined,
  mime: string | null | undefined,
}
export const ProductRowKeys = Object.keys(PRODUCT_COLUMNS) as (keyof ProductRow)[]

const selectColumnsPhrase = ProductRowKeys.join(', ')

export async function readProducts() {
  const db = useDatabase();
  try {
    // SQL-Abfrage: Alle Produkte auslesen
    const rows = (await db.prepare(`
      SELECT ${selectColumnsPhrase}
      FROM products;
    `).all()) as ProductRow[];

    const products = rows.map(p => ({
      ...p,
      active: p.active === 1,
      image: p.image ?  uint8ArrayToBlob(p.image, p.mime) : undefined
    }) as Product);


    console.log(`Insgesamt ${rows.length} Produkte gefunden.`);
    return Promise.all(products.map(async p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      id: p.id,
      imageDataUrl: p.image ? await blobToDataUrl(p.image) : undefined,
      active: p.active,
    }) as ApiProduct));
  } catch (err) {
    console.error('Fehler beim Auslesen der Produkte:', err);
    return [];
  }
}
