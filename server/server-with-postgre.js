import { createApp } from './app.js';
import { ProductModel } from './models/Postgres/productos.js';

createApp({ productModel: ProductModel });