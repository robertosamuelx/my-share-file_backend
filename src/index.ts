import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes';
import morgan from 'morgan';
import mongoose from 'mongoose';

const app = express();

mongoose.connect(String(process.env.BD_ADDRESS), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(routes);

app.listen(process.env.PORT || 3000);