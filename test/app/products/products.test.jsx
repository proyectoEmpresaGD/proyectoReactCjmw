import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Product from '../../../src/app/products/products';

vi.mock('../../../src/components/header', () => ({
    Header: () => <div>Header mock</div>,
}));

vi.mock('../../../src/components/ComponentesProductos/cardProduct', () => ({
    default: () => <div>CardProduct mock</div>,
}));

vi.mock('../../../src/components/CartContext', () => ({
    CartProvider: ({ children }) => <>{children}</>,
}));

const tMock = vi.fn((key, options) => {
    if (key === 'papel') return 'Papel';
    if (key === 'telas') return 'Telas';
    if (key === 'allProducts') return 'Todos los productos';

    if (key === 'categories.easyClean') return 'Easy Clean';
    if (key === 'categories.rayas') return 'Rayas';
    if (key === 'categories.tapiceria') return 'Tapicería';

    return key;
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: tMock,
    }),
}));

describe('Product page', () => {
    beforeEach(() => {
        document.title = '';
        vi.clearAllMocks();
    });

    it('renderiza header y card product', () => {
        render(
            <MemoryRouter initialEntries={['/products']}>
                <Product />
            </MemoryRouter>
        );

        expect(screen.getByText('Header mock')).toBeInTheDocument();
        expect(screen.getByText('CardProduct mock')).toBeInTheDocument();
    });

    it('pone título por defecto cuando no hay filtros', async () => {
        render(
            <MemoryRouter initialEntries={['/products']}>
                <Product />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.title).toBe('Todos los productos');
        });
    });

    it('usa "Papel" cuando type=papel', async () => {
        render(
            <MemoryRouter initialEntries={['/products?type=papel']}>
                <Product />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.title).toBe('Papel');
        });
    });

    it('usa "Telas" cuando type no es papel', async () => {
        render(
            <MemoryRouter initialEntries={['/products?type=telas']}>
                <Product />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.title).toBe('Telas');
        });
    });

    it('concatena colección y filtros traducidos', async () => {
        render(
            <MemoryRouter initialEntries={['/products?collection=Premium&fabricPattern=RAYAS&type=papel']}>
                <Product />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.title).toBe('Premium – Rayas – Papel');
        });
    });

    it('traduce EASYCLEAN como easyClean', async () => {
        render(
            <MemoryRouter initialEntries={['/products?mantenimiento=EASYCLEAN']}>
                <Product />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.title).toBe('Easy Clean');
        });
    });
});
