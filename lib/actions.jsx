import bcrypt from 'bcryptjs';
import { signIn, signOut } from './auth';
import db from './db';  // Importamos la conexión a la base de datos que hemos creado

// LOGIN con credenciales
export async function login(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    // Comprobamos si el usuario está registrado
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!user.rows.length) {
        return { error: 'Usuario no registrado.' };
    }

    // Comparamos password 
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);

    if (matchPassword) {
        await signIn('credentials', { email, password, redirectTo: '/' });
    } else {
        return { error: 'Credenciales incorrectas.' };
    }
}

// LOGIN con Google
export async function loginGoogle() {
    await signIn('google', { redirectTo: '/' });
}

// LOGOUT
export async function logout() {
    await signOut({ redirectTo: '/' });
}

// Recoger los ids de los productos
export async function getProductosIds() {
    const response = await db.query('SELECT id FROM productos');
    return response.rows.map(p => p.id);
}

// Recoger todos los productos
export async function getProductos() {
    const response = await db.query('SELECT * FROM productos');
    return response.rows;
}

// Recoger un solo producto por su id
export async function getProducto(CodProdu) {
    const response = await db.query('SELECT * FROM productos WHERE CodProdu = $1', [CodProdu]);
    return response.rows[0];
}

// Recoger productos los cuales tengan una marca en concreto
export async function getProductosPorMarca(CodMarca) {
    const response = await db.query('SELECT * FROM productos WHERE CodMarca = $1', [CodMarca]);
    return response.rows;
}

// Recoger productos los cuales tengan una coleccion en concreto
export async function getProductosPorColeccion(coleccion) {
    const response = await db.query('SELECT * FROM productos WHERE coleccion = $1', [coleccion]);
    return response.rows;
}
