import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.js'
import cors from 'cors';
import {connectDB} from './data/database.js'
import { errorMiddleWare } from './middlewares/error.js';
import path from 'path';
import { fileURLToPath } from 'url';

config({
    path: './data/config.env'
})

const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  exposedHeaders: ['X-Total-Count'],
}))

app.use('/api/v1',indexRouter);


app.get('/', (req,res)=>{
    res.send('Hello')
})

app.use(errorMiddleWare);

app.listen(process.env.PORT, () => {
    console.log(
      `Server is working on port:${process.env.PORT} in ${process.env.NODE_ENV} mode`
    );
  });