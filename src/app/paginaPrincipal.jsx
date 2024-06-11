import React from 'react';
import Carrusel from "../components/ComponentesHome/carrusel";
import { Header } from "../components/header";
import Footer from "../components/footer";
import Works from "../components/ComponentesHome/pinesNoticias";
import Clients from "../components/ComponentesHome/clients";
import { CartProvider } from '../components/CartContext';

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function Home() {
    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <Works />
                <Clients />
                <Footer />
            </CartProvider>
        </>
    );
}

export default Home;
