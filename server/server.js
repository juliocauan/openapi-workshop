const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Dados Mock ---
let products = [
    { id: 101, nome: "Smartphone X", preco: 2500.00, em_estoque: true },
    { id: 102, nome: "Fone Bluetooth", preco: 350.50, em_estoque: false },
    { id: 103, nome: "Notebook Pro", preco: 4500.00, em_estoque: true },
    { id: 104, nome: "Mouse Gamer", preco: 250.00, em_estoque: true },
    { id: 105, nome: "Teclado Mecânico", preco: 450.00, em_estoque: false }
];

let nextProductId = 106;

// ====================================
// ROTAS (ENDPOINTS)
// ====================================

app.get('/products-list', (req, res) => {
    console.log('GET /products-list acessada');
    res.status(200).json(products);
});

app.post('/new-product', (req, res) => {
    const { nome, price } = req.body;
    
    if (!nome || !price) {
        return res.status(400).json({ 
            mensagem: "Campos 'nome' e 'price' são obrigatórios.",
            codigo: 400
        });
    }

    const newProduct = {
        id: nextProductId++,
        nome: nome,
        preco: price,
        em_estoque: true
    };
    
    products.push(newProduct);
    console.log(`POST /new-product - Produto criado: ID ${newProduct.id}`);
    res.status(201).json(newProduct); 
});

app.get('/products/:produtoId', (req, res) => {
    const produtoId = parseInt(req.params.produtoId);
    const product = products.find(p => p.id === produtoId);

    if (!product) {
        return res.status(404).json({ 
            mensagem: "Produto não encontrado.",
            codigo: 404
        });
    }

    console.log(`GET /products/${produtoId} acessada`);
    res.status(200).json(product);
});

app.put('/update-product/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const { nome, price } = req.body;
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ 
            mensagem: "Produto não encontrado.",
            codigo: 404
        });
    }

    if (!nome || !price) {
        return res.status(400).json({ 
            mensagem: "Campos 'nome' e 'price' são obrigatórios.",
            codigo: 400
        });
    }

    // Atualiza o produto mantendo o ID e em_estoque
    products[productIndex] = {
        ...products[productIndex],
        nome: nome,
        preco: price
    };

    console.log(`PUT /update-product/${productId} - Produto atualizado`);
    res.status(200).json(products[productIndex]);
});

app.delete('/remove-product/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ 
            mensagem: "Produto não encontrado.",
            codigo: 404
        });
    }

    products.splice(productIndex, 1);
    console.log(`DELETE /remove-product/${productId} - Produto removido`);
    res.status(204).send();
});

// Inicializa servidor
app.listen(PORT, () => {
    console.log(`\n Servidor rodando em http://localhost:${PORT}`);
    console.log('\n ATENÇÃO: Este servidor contém INCONSISTÊNCIAS propositais!');
    console.log('\n Rotas implementadas (INCORRETAS):');
    console.log('    GET    /products-list');
    console.log('    POST   /new-product');
    console.log('    GET    /products/:produtoId');
    console.log('    PUT    /update-product/:productId');
    console.log('    DELETE /remove-product/:productId');
    console.log('\n Rotas corretas segundo OpenAPI:');
    console.log('   ✓ GET    /produtos');
    console.log('   ✓ POST   /produtos');
    console.log('   ✓ GET    /produtos/:id');
    console.log('   ✓ PUT    /produtos/:id');
    console.log('   ✓ DELETE /produtos/:id');
    console.log('\n💡 Use o OpenAPI Generator para gerar o client correto!\n');
});
