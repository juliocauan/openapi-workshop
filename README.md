## Workshop: Alinhando Implementação ao Contrato OpenAPI

## Pré-requisitos
- Node.js instalado
- npm
- Java 11+ (Usado para rodar o openapi-generator)
- Editor de código (VS Code recomendado)

## Setup Inicial

### Backend (Node.js)
```bash
cd server
npm install
node server.js
```

Servidor estará rodando em: http://localhost:3000

### Frontend (Angular)
```bash
cd client
npm install
npm start
```

Aplicação estará rodando em: http://localhost:4200

### 🎯 Objetivo

A implementação atual da aplicação de catálogo de produtos está funcionando AGORA, mas ela está desalinhada do nosso **contrato ideal** definido no `openapi.yml`. Este desalinhamento leva a complexidade, duplicação de lógica e erros futuros na integração entre as equipes de frontend e backend. O **OpenAPI nos diz exatamente o que precisa ser corrigido**.

O objetivo deste workshop é utilizar o OpenAPI Generator para gerar um cliente de serviços padronizado e, em seguida, refatorar o frontend e o backend para aderir a esse contrato.

---

### 🚀 Fluxo de Trabalho

1.  **Gere o Cliente:** Use o **OpenAPI Generator CLI** para criar o cliente Angular a partir do arquivo `openapi.yml`.
2.  **Refatore o Frontend:** Substitua o `ProductService` manual (`product.service.ts`) pelo cliente gerado. Ajuste o `ProductFormComponent` (`product-form.component.ts`) para usar as novas interfaces e métodos tipados.
3.  **Refatore o Backend:** Implemente a lógica de negócio no *handler* gerado (`ProdutosService.js`) para **alinhar rotas** e **campos de *payload*** com o contrato `openapi.yml`.

---

### Dicas de Implementação no `ProdutosService.js`

Ao migrar a lógica do `server.js` para o `ProdutosService.js`, considere:

1.  **Assinatura da Função:** Use `( req ) => new Promise`. O objeto `req` contém os parâmetros de rota (`req.id`) e o corpo da requisição (`req.body`).
2.  **Respostas do Serviço:** O `resolve(Service.successResponse(...))` deve retornar o **dado de resposta real** (não apenas o ID de entrada) e o **código de status HTTP correto** (e.g., `201` para POST, `204` para DELETE).'


## Observação do Backend (ProdutosService.js) 🛠️

O `nodejs-express-server` *generator* ainda está em **beta**, o que exige ajustes manuais no arquivo *handler* gerado (`ProdutosService.js`) para integrar a lógica de negócio corretamente.

## Comandos auxiliares

### OpenAPI Code Generator

Gerar servidor Node.js (Express) baseado no OpenAPI:

    npx @openapitools/openapi-generator-cli generate -i openapi.yml -g nodejs-express-server -o ./server/generated

Gerar cliente Angular baseado no OpenAPI:

    npx @openapitools/openapi-generator-cli generate -i openapi.yml -g typescript-angular -o ./client/generated

------------------------------------------------------------------------

Iniciar servidor problemático

    cd server/
    node server.js

Iniciar servidor gerado pelo OpenAPI

    cd server/generated
    node index.js

------------------------------------------------------------------------

Iniciar front-end

    cd client/
    npm start
    