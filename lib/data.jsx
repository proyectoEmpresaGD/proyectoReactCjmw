import db from "./db"



//Funcion para recoger un usuario por su id
export async function getUserById(id) {
    try {
        const user = await db.user.findUnique({
            where: { id }
        });
        return user;
    } catch (error) {
        console.error("Error al obtener el usuario por ID:", error);
        throw error;
    }
}

//Funcion para recoger un usuario por su correo electronico
export async function getUserByEmail(email) {
    try {
        const user = await db.user.findUnique({
            where: { email }
        });
        return user;
    } catch (error) {
        console.error("Error al obtener el usuario por correo electrónico:", error);
        throw error;
    }
}