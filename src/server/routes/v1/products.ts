import {defineEventHandler} from 'h3';
import {ApiProduct} from "../../../models/product";
import {readProducts} from "../../db/skripts/read-products";


export default defineEventHandler(async () => {
  const dbEntities = await readProducts()

  if (dbEntities.length > 5) {
    return dbEntities;
  }

  return [{
    id: 1,
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    imageTag: 'bamboo'
  },
    {
      id: 2,
      code: 'nvklal433',
      name: 'Black Watch',
      description: 'Product Description',
      price: 72,
      category: 'Accessories',
      quantity: 61,
      inventoryStatus: 'INSTOCK',
      rating: 4,
      imageTag: 'black'
    },
    {
      id: 3,
      code: 'zz21as',
      name: 'Blue Band',
      description: 'Product Description',
      price: 79,
      category: 'Fitness',
      quantity: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 3,
      imageTag: 'blue'
    },
    {
      id: 4,
      code: '244wger',
      name: 'Blue T-Shirt',
      description: 'Product Description',
      price: 29,
      category: 'Clothing',
      quantity: 25,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      imageTag: 'blue'
    },
    {
      id: 5,
      code: 'h456wer',
      name: 'Bracelet',
      description: 'Product Description',
      price: 15,
      category: 'Accessories',
      quantity: 73,
      inventoryStatus: 'INSTOCK',
      rating: 4,
      imageTag: 'bracelet'
    },
    {
      id: 6,
      code: 'av2231fw',
      name: 'Brown Purse',
      description: 'Product Description',
      price: 120,
      category: 'Accessories',
      quantity: 0,
      inventoryStatus: 'OUTOFSTOCK',
      rating: 4,
      imageTag: 'brown'
    },
    {
      id: 7,
      code: 'bib36pf',
      name: 'Chakra Bracelet',
      description: 'Product Description',
      price: 32,
      category: 'Accessories',
      quantity: 5,
      inventoryStatus: 'LOWSTOCK',
      rating: 3,
      imageTag: 'chakra'
    },
    {
      id: 8,
      code: 'mbvjkgip',
      name: 'Galaxy Earrings',
      description: 'Product Description',
      price: 34,
      category: 'Accessories',
      quantity: 23,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      imageTag: 'galaxy'
    },
    {
      id: 9,
      code: 'vbb124gj',
      name: 'Game Controller',
      description: 'Product Description',
      price: 99,
      category: 'Electronics',
      quantity: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 4,
      imageTag: 'game'
    },
    {
      id: 10,
      code: 'cm230f032',
      name: 'Gaming Set',
      description: 'Product Description',
      price: 299,
      category: 'Electronics',
      quantity: 63,
      inventoryStatus: 'INSTOCK',
      rating: 3,
      imageTag: 'gaming'
    },
    {
      id: 11,
      code: 'plb341f',
      name: 'Gold Phone Case',
      description: 'Product Description',
      price: 24,
      category: 'Accessories',
      quantity: 0,
      inventoryStatus: 'OUTOFSTOCK',
      rating: 4,
      imageTag: 'gold'
    },
    {
      id: 12,
      code: 'stbg334',
      name: 'Green Earbuds',
      description: 'Product Description',
      price: 89,
      category: 'Electronics',
      quantity: 23,
      inventoryStatus: 'INSTOCK',
      rating: 4,
      imageTag: 'green'
    },
    {
      id: 13,
      code: 'htrg226',
      name: 'Green T-Shirt',
      description: 'Product Description',
      price: 49,
      category: 'Clothing',
      quantity: 74,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      imageTag: 'green'
    },
    {
      id: 14,
      code: 'jwregf',
      name: 'Grey T-Shirt',
      description: 'Product Description',
      price: 9,
      category: 'Clothing',
      quantity: 34,
      inventoryStatus: 'INSTOCK',
      rating: 3,
      imageTag: 'grey'
    },
    {
      id: 15,
      code: 'jepw01',
      name: 'Headphones',
      description: 'Product Description',
      price: 349,
      category: 'Electronics',
      quantity: 15,
      inventoryStatus: 'INSTOCK',
      rating: 5,
      imageTag: 'headphones'
    },
    {
      id: 16,
      name: 'Light Green T-Shirt',
      description: 'Product Description',
      price: 49,
      category: 'Clothing',
    },
  ].concat(dbEntities) as ApiProduct[]
});
