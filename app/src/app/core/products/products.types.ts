export interface Products {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  code: string;
  stock: number;
  category: string;
  owner: string;
}

export interface GetProductsResponse {
  message: Products[];
}

export interface GetProductByIdResponse {
  message: Products;
}
