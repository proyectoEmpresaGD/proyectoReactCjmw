import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/auth';
import { getUserByEmail } from '@/lib/data';
import { redirect } from 'next/navigation';


// REGISTER
/*export async function register(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    // Comprobamos si el usuario ya está registrado
    const user = await getUserByEmail(email);

    if (user) {
        return { error: 'El email ya está registrado' }
    }

    // Encriptamos password 
    const hashedPassword = await bcrypt.hash(password, 10)

    // Guardamos credenciales en base datos
    await BaseDatos.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    return { success: "Registro correcto" }
}
*/


//LOGIN con credenciales
export async function login(formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    // Comprobamos si el usuario está registrado
    const user = await getUserByEmail(email);

    if (!user) {
        return { error: 'Usuario no registrado.' }
    }

    // Comparamos password 
    const matchPassword = await bcrypt.compare(password, user.password)

    if (user && matchPassword) {  // && user.emailVerified
        await signIn('credentials', { email, password, redirectTo: '/' })
        // return { success: "Inicio de sesión correcto" }
    } else {
        return { error: 'Credenciales incorrectas.' }
    }

}

//LOGIN con google
export async function loginGoogle() {
    await signIn('google', { redirectTo: '/' })
}

// LOGOUT
export async function logout() {
    await signOut({ redirectTo: '/' })
}



//Recoger los ids de los productos

async function getProductosIds() {

    const CodProducto = await /*BaseDeDatosImportada.*/CodProducto.findMany({
        select: { id: true }
    })
    return CodProducto.map(p => p.id)
}




//Recoger todos los productos 

export async function getProductos() {
    const producto = await /*BaseDeDatosImportada.*/producto.findMany()
    return producto
}



//Recoger un solo producto por su id
export async function getProducto(CodProdu) {
    const producto = await /*BaseDeDatosImportada.*/producto.findUnique({
        where: { CodProdu },
        include: {
            colecciones: true
        }
    })
    return producto
}



//Recoger productos los cuales tengan una marca en concreto
export async function getProductosPorMarca(CodMarca) {
    const producto = await /*BaseDeDatosImportada.*/producto.findMany({
        where: {CodMarca}
    })
}


//Recoger productos los cuales tengan una coleccion en concreto
export async function getProductosPorColeccion(coleccion) {
    const producto = await /*BaseDeDatosImportada.*/producto.findMany({
        where: { coleccion }
    })
}