/* eslint-disable no-unused-vars */
const Service = require('./Service');

// --- Dados Mock ---
let products = [
    { id: 101, nome: "Smartphone X", preco: 2500.00, em_estoque: true },
    { id: 102, nome: "Fone Bluetooth", preco: 350.50, em_estoque: false },
    { id: 103, nome: "Notebook Pro", preco: 4500.00, em_estoque: true },
    { id: 104, nome: "Mouse Gamer", preco: 250.00, em_estoque: true },
    { id: 105, nome: "Teclado Mecânico", preco: 450.00, em_estoque: false }
];

let nextProductId = 106;
/**
* Cadastra um novo produto
* Cria um novo item no catálogo de produtos.
*
* novoProduto NovoProduto 
* returns Produto
* */
const createProduct = ( req ) => new Promise(
  async (resolve, reject) => {
    try {
      const { nome, preco } = req.body;
      
      if (!nome || !preco) {
        const error = new Error("Campos 'nome' e 'preco' são obrigatórios.");
        error.status = 400;
        throw error;
      }

      const newProduct = {
          id: nextProductId++,
          nome: nome,
          preco: preco,
          em_estoque: true
      };
      
      products.push(newProduct);
      console.log(`POST /produto - Produto criado: ID ${newProduct.id}`);
      resolve(Service.successResponse(newProduct, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Remove um produto por ID
*
* id Long ID único do produto.
* no response value expected for this operation
* */
const deleteProduct = ( req ) => new Promise(
  async (resolve, reject) => {
    try {
      const productId = parseInt(req.id);
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) {
        const error = new Error("Produto não encontrado.");
        error.status = 404;
        throw error;
      }

      const deletedProduct = products[productIndex];
      products.splice(productIndex, 1);
      console.log(`DELETE /produtos/${productId} - Produto removido`);
      resolve(Service.successResponse(deletedProduct, 204));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtém produto por ID
*
* id Long ID único do produto.
* returns Produto
* */
const getProductById = ( req ) => new Promise(
  async (resolve, reject) => {
    try {
      const produtoId = parseInt(req.id);
      const productIndex = products.findIndex(p => p.id === produtoId);

      if (productIndex === -1) {
        const error = new Error("Produto não encontrado.");
        error.status = 404;
        throw error;
      }

      console.log(`GET /produtos/${produtoId} acessada`);
      resolve(Service.successResponse(products[productIndex]));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Lista todos os produtos
* Retorna uma lista paginada ou completa de produtos.
*
* returns List
* */
const getProducts = () => new Promise(
  async (resolve, reject) => {
    try {
      console.log('GET /produtos acessada');
      resolve(Service.successResponse(products));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Atualiza um produto existente
*
* id Long ID único do produto.
* novoProduto NovoProduto 
* returns Produto
* */
const updateProduct = ( req ) => new Promise(
  async (resolve, reject) => {
    try {
      const productId = parseInt(req.id);
      const { nome, preco } = req.body;
      
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) {
        const error = new Error("Produto não encontrado.");
        error.status = 404;
        throw error;
      }

      if (!nome || !preco) {
        const error = new Error("Campos 'nome' e 'preco' são obrigatórios.");
        error.status = 400;
        throw error;
      }

      // Atualiza o produto mantendo o ID e em_estoque
      products[productIndex] = {
          ...products[productIndex],
          nome: nome,
          preco: preco
      };

      console.log(`PUT /produtos/${productId} - Produto atualizado`);
      resolve(Service.successResponse(products[productIndex]));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
};
