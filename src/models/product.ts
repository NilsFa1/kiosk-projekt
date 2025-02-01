export interface Product {
  id: number,
  name: string,
  description: string,
  image?: Blob,
  price: number,
  category: string,
  active: boolean,
}

export interface ApiProduct extends Omit<Product, 'image'> {
  id: number,
  name: string,
  description: string,
  imageDataUrl?: string,
  price: number,
  category: string,
}
