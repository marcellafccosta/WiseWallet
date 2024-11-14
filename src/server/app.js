import express from 'express';
import cors from 'cors';
import routes from './routes';  // Importa as rotas definidas em outro arquivo (GastoRoutes, CategoriaRoutes)

const app = express();

// Middleware para interpretar o corpo da requisição como JSON
app.use(express.json());

// Middleware para configurar o CORS (Cross-Origin Resource Sharing).
// Permite que o frontend que está rodando em http://localhost:5173 acesse a API.
app.use(cors({
    origin: 'http://localhost:5173'  // Permite requisições apenas dessa URL
}));

// Usar as rotas definidas no arquivo de rotas (routes.js)
app.use(routes);

// Middleware para captura de erros. 
// Se algum erro ocorrer em uma rota, esse middleware será chamado.
app.use((err, req, res, next) => {
    console.error(err.stack);  // Loga o erro completo no console para facilitar a depuração
    // Retorna uma resposta com status 500 e uma mensagem de erro detalhada.
    res.status(500).json({ error: err.message || 'Algo deu errado!' });
});

// Exporta a instância do app para ser usada no servidor
export default app;
