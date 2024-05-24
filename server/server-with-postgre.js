import { createApp } from './index.js';
import { ProductModel } from './models/Postgres/productos.js';

createApp({ productModel: ProductModel });