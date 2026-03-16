import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    searchLinings,
    getProductColors,
    searchCurtainFabrics,
    searchWallpapers,
    searchUpholsteryFabrics,
} from '../../src/api/products';

describe('products api', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch = vi.fn();
    });

    it('searchLinings devuelve items', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                items: [{ id: 1, nombre: 'Forro A' }],
            }),
        });

        const result = await searchLinings({ names: ['A'], q: 'forro' });

        expect(fetch.mock.calls[0][0]).toContain('/api/products/linings/search');
        expect(fetch.mock.calls[0][1]).toMatchObject({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
            names: ['A'],
            q: 'forro',
        });
        expect(result).toHaveLength(1);
    });

    it('searchLinings lanza el texto del backend si falla', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'backend roto',
        });

        await expect(searchLinings({ q: 'x' })).rejects.toThrow('backend roto');
    });

    it('getProductColors devuelve colores', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                colors: [{ id: 1, name: 'Rojo' }],
            }),
        });

        const result = await getProductColors(10);

        expect(fetch.mock.calls[0][0]).toContain('/api/products/10/colors');
        expect(result).toEqual([{ id: 1, name: 'Rojo' }]);
    });

    it('getProductColors lanza error con status si falla', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        await expect(getProductColors(22)).rejects.toThrow('Error 404 cargando colores');
    });

    it('searchCurtainFabrics transforma correctamente la respuesta', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                items: [
                    {
                        codprodu: 'T-1',
                        nombre: 'Tejido lino',
                        precioMetro: '24,50 €',
                        imageUrl: '/img/lino.jpg',
                        ancho: '280 cm',
                    },
                ],
            }),
        });

        const result = await searchCurtainFabrics({ q: 'lino' });

        expect(fetch.mock.calls[0][0]).toContain('/api/products/curtains/search');
        expect(result).toEqual([
            {
                id: 'T-1',
                name: 'Tejido lino',
                pricePerMeter: 24.5,
                imageUrl: '/img/lino.jpg',
                ancho: '280 cm',
            },
        ]);
    });

    it('searchCurtainFabrics devuelve [] si backend no responde ok', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const result = await searchCurtainFabrics({ q: 'x' });
        expect(result).toEqual([]);
    });

    it('searchWallpapers transforma colección, precio y tipo', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                items: [
                    {
                        codprodu: 'P-1',
                        nombre: 'Papel floral',
                        imageUrl: '/img/papel.jpg',
                        coleccion: 'Spring',
                        price: '39.95',
                        width: '53cm',
                        type: 'wallpaper',
                        style: 'floral',
                    },
                ],
            }),
        });

        const result = await searchWallpapers({ limit: 50 });

        expect(fetch.mock.calls[0][0]).toContain('/api/products/wallpapers/search');
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ limit: 50 });

        expect(result).toEqual([
            {
                id: 'P-1',
                name: 'Papel floral',
                imageUrl: '/img/papel.jpg',
                collection: 'Spring',
                price: 39.95,
                width: '53cm',
                type: 'wallpaper',
                style: 'floral',
            },
        ]);
    });

    it('searchWallpapers devuelve [] si falla', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const result = await searchWallpapers();
        expect(result).toEqual([]);
    });

    it('searchUpholsteryFabrics transforma items válidos', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                items: [
                    {
                        id: 90,
                        name: 'Terciopelo',
                        pricePerMeter: 30,
                        imageUrl: '/img/terciopelo.jpg',
                    },
                ],
            }),
        });

        const result = await searchUpholsteryFabrics({ q: 'terciopelo' });

        expect(fetch.mock.calls[0][0]).toContain('/api/products/upholstery/search');
        expect(result).toEqual([
            {
                id: 90,
                name: 'Terciopelo',
                pricePerMeter: 30,
                imageUrl: '/img/terciopelo.jpg',
            },
        ]);
    });

    it('searchUpholsteryFabrics devuelve [] si falla', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        const result = await searchUpholsteryFabrics({ q: 'x' });
        expect(result).toEqual([]);
    });
});
