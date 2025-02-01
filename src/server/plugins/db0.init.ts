import {defineNitroPlugin} from "nitropack/runtime";
import {createProductsTable} from "../db/skripts/create-product-table";
import {createUsersTable} from "../db/skripts/create-user-table";

export default defineNitroPlugin(async () => {
  // Sobald dieses Plugin geladen wird die tabelle erstellt

  await createProductsTable();
  await createUsersTable();

  console.log('db0: Tabellen erstellt');
});
