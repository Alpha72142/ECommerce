import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import  authRoutes  from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoutes.js';
import cors from 'cors'

//config file
dotenv.config();

//connect database
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

//rest api
app.get('/', (req, res) => {
    res.send(
        
           "<h1>Welcome to ecommerce</h1>"
        
    );
})

// port 

const PORT = process.env.PORT || 8080;


// run listen
app.listen(PORT,()=>
{
    console.log(`Server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})