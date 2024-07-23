import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

// app.use(
//     // cors({
//     //     origin: process.env.CORS_ORIGIN,
//     //     credentials: true,
//     // })
//     cors()
// );
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.json({
        message: 'Hello',
    });
});

import agentRouter from './routes/agent.routes.js';
import headRouter from './routes/head.routes.js';
import policyRouter from './routes/policy.routes.js';
import relationshipManagerRouter from './routes/relationshipManager.routes.js';
import CustomerRouter from './routes/customer.routes.js';
import corpInsRouter from './routes/corpIns.routes.js';
import insCompRouter from './routes/insComp.routes.js';
import medicalInsRouter from './routes/medicalIns.routes.js';
import productRouter from './routes/product.routes.js';
import motorInsRouter from './routes/motorIns.routes.js';

app.use('/api/v2/agent', agentRouter);
app.use('/api/v2/head', headRouter);
app.use('/api/v2/policy', policyRouter);
app.use('/api/v2/rm', relationshipManagerRouter);
app.use('/api/v2/customer', CustomerRouter);
app.use('/api/v2/corpins', corpInsRouter);
app.use('/api/v2/inscomp', insCompRouter);
app.use('/api/v2/medicalins', medicalInsRouter);
app.use('/api/v2/product', productRouter);
app.use('/api/v2/motorins', motorInsRouter);

export default app;
