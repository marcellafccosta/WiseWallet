import express from 'express';
import cors from 'cors';
import routes from "./src/routes/routes.js"

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'  
}));

app.use(routes);

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({ error: err.message || 'Algo deu errado!' });
});

export default app;
