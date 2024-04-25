import db from './db';

// Obtener todos los productos
export async function getAllProducts() {
    try {
        const query = 'SELECT * FROM productos';
        const response = await db.query(query);
        return response.rows;
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        throw error;
    }
}

// Obtener un producto por su código de producto
export async function getProductByCode(codProdu) {
    try {
        const query = 'SELECT * FROM productos WHERE CodProdu = $1';
        const response = await db.query(query, [codProdu]);
        return response.rows[0];
    } catch (error) {
        console.error('Error al obtener el producto por código:', error);
        throw error;
    }
}

// Obtener productos por código de marca
export async function getProductsByMarca(codMarca) {
    try {
        const query = 'SELECT * FROM productos WHERE CodMarca = $1';
        const response = await db.query(query, [codMarca]);
        return response.rows;
    } catch (error) {
        console.error('Error al obtener los productos por código de marca:', error);
        throw error;
    }
}

// Insertar un nuevo producto
export async function insertProduct(productData) {
    try {
        const {
            CodProdu,
            DesProdu,
            CodFamil,
            CodSubFamil,
            CodMarca,
            CodTipo,
            FecAlta,
            StockSN,
            PreCosto,
            UltCodProve,
            UltFecCompra,
            UltPreCompra,
            UltCodClien,
            UltFecVenta,
            UltPreVenta,
            CodCtaContabCompra,
            CodCtaContabVenta,
            Comentario,
            NRB,
            CodClase,
            PRC,
            PUFC,
            PUFV,
            PMC,
            PMV,
            Operador,
            TraLotes,
            BloqEdicPreVentas,
            TipNumSerie,
            UltPreCompraNeto,
            UltPreVentaNeto,
            PUFCNeto,
            PUFVNeto,
            ReqTarCompra,
            PMCImput,
            UltFecActPRC,
            UltPreCompraNetoImput,
            PUFCNetoImput
        } = productData;

        const query = `
            INSERT INTO productos (
                CodProdu, DesProdu, CodFamil, CodSubFamil, CodMarca, CodTipo, FecAlta, 
                StockSN, PreCosto, UltCodProve, UltFecCompra, UltPreCompra, UltCodClien, 
                UltFecVenta, UltPreVenta, CodCtaContabCompra, CodCtaContabVenta, Comentario, 
                NRB, CodClase, PRC, PUFC, PUFV, PMC, PMV, Operador, TraLotes, BloqEdicPreVentas, 
                TipNumSerie, UltPreCompraNeto, UltPreVentaNeto, PUFCNeto, PUFVNeto, ReqTarCompra, 
                PMCImput, UltFecActPRC, UltPreCompraNetoImput, PUFCNetoImput
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
                    $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40)
        `;

        const values = [
            CodProdu, DesProdu, CodFamil, CodSubFamil, CodMarca, CodTipo, FecAlta,
            StockSN, PreCosto, UltCodProve, UltFecCompra, UltPreCompra, UltCodClien,
            UltFecVenta, UltPreVenta, CodCtaContabCompra, CodCtaContabVenta, Comentario,
            NRB, CodClase, PRC, PUFC, PUFV, PMC, PMV, Operador, TraLotes, BloqEdicPreVentas,
            TipNumSerie, UltPreCompraNeto, UltPreVentaNeto, PUFCNeto, PUFVNeto, ReqTarCompra,
            PMCImput, UltFecActPRC, UltPreCompraNetoImput, PUFCNetoImput
        ];

        await db.query(query, values);
    } catch (error) {
        console.error('Error al insertar un nuevo producto:', error);
        throw error;
    }
}

// Actualizar un producto existente
export async function updateProduct(productData) {
    try {
        const {
            CodProdu,
            DesProdu,
            CodFamil,
            CodSubFamil,
            CodMarca,
            CodTipo,
            FecAlta,
            StockSN,
            PreCosto,
            UltCodProve,
            UltFecCompra,
            UltPreCompra,
            UltCodClien,
            UltFecVenta,
            UltPreVenta,
            CodCtaContabCompra,
            CodCtaContabVenta,
            Comentario,
            NRB,
            CodClase,
            PRC,
            PUFC,
            PUFV,
            PMC,
            PMV,
            Operador,
            TraLotes,
            BloqEdicPreVentas,
            TipNumSerie,
            UltPreCompraNeto,
            UltPreVentaNeto,
            PUFCNeto,
            PUFVNeto,
            ReqTarCompra,
            PMCImput,
            UltFecActPRC,
            UltPreCompraNetoImput,
            PUFCNetoImput
        } = productData;

        const query = `
            UPDATE productos 
            SET 
                DesProdu = $1, 
                CodFamil = $2, 
                CodSubFamil = $3, 
                CodMarca = $4, 
                CodTipo = $5, 
                FecAlta = $6, 
                StockSN = $7, 
                PreCosto = $8, 
                UltCodProve = $9, 
                UltFecCompra = $10, 
                UltPreCompra = $11, 
                UltCodClien = $12, 
                UltFecVenta = $13, 
                UltPreVenta = $14, 
                CodCtaContabCompra = $15, 
                CodCtaContabVenta = $16, 
                Comentario = $17, 
                NRB = $18, 
                CodClase = $19, 
                PRC = $20, 
                PUFC = $21, 
                PUFV = $22, 
                PMC = $23, 
                PMV = $24, 
                Operador = $25, 
                TraLotes = $26, 
                BloqEdicPreVentas = $27, 
                TipNumSerie = $28, 
                UltPreCompraNeto = $29, 
                UltPreVentaNeto = $30, 
                PUFCNeto = $31, 
                PUFVNeto = $32, 
                ReqTarCompra = $33, 
                PMCImput = $34, 
                UltFecActPRC = $35, 
                UltPreCompraNetoImput = $36, 
                PUFCNetoImput = $37
            WHERE CodProdu = $38
        `;

        const values = [
            DesProdu,
            CodFamil,
            CodSubFamil,
            CodMarca,
            CodTipo,
            FecAlta,
            StockSN,
            PreCosto,
            UltCodProve,
            UltFecCompra,
            UltPreCompra,
            UltCodClien,
            UltFecVenta,
            UltPreVenta,
            CodCtaContabCompra,
            CodCtaContabVenta,
            Comentario,
            NRB,
            CodClase,
            PRC,
            PUFC,
            PUFV,
            PMC,
            PMV,
            Operador,
            TraLotes,
            BloqEdicPreVentas,
            TipNumSerie,
            UltPreCompraNeto,
            UltPreVentaNeto,
            PUFCNeto,
            PUFVNeto,
            ReqTarCompra,
            PMCImput,
            UltFecActPRC,
            UltPreCompraNetoImput,
            PUFCNetoImput,
            CodProdu
        ];

        await db.query(query, values);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        throw error;
    }
}

// Eliminar un producto por su código de producto
export async function deleteProductByCode(codProdu) {
    try {
        const query = 'DELETE FROM productos WHERE CodProdu = $1';
        await db.query(query, [codProdu]);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
}
