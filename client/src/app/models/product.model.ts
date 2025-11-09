export interface Product {
  id: number;
  nome: string;
  preco: number;
  em_estoque: boolean;
}

export interface NewProduct {
  nome: string;
  preco: number;
}