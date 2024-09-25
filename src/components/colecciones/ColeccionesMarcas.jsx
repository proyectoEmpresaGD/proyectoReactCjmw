import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CartProvider } from '../CartContext';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
const imageSet = {
  'ARE': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/ATMOSPHERE/ATMOSPHERE%20MOSS.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20BLOSSOM.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20SHELL.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/ATMOSPHERE/STORM%20DUSK.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY%203.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/MONTECARLO%20RUBY%204.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/DUNE/DUNE%20SAHARA.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/DUNE/DUNE%20PATAGONIA.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/DUNE/AMASTISTA%20ALOE.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/JEWEL/JEWEL%20NORDIC%20BLUE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%203.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20ALUMINIUM.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/FOMENTERA%20STONE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/PADDINGTON.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MONTANA/COJINES%20MONTANA.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MONTANA/MONTANA%20ONIX.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MONTANA/YELLOWSTONE%20PORCELAIN%203.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/NOMAD/HABITAT%20SAND.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/NOMAD/LUNAR%20BURGUNDY.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/NOMAD/NOMAD%20BURGUNDY%203.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PAPIRO/SMOKE%20ASH.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PURITTY/SHROUD%20WHITE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PURITTY/TRELLIS%20OFF%20WHITE%202.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET(1).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/RUSTICA/RUSTICA.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/STONE/STONE%20CANAIMA.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/STONE/STONE%20CANAIMA%202.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/STRATOS/ANTILLA%20VELVET%20C%2003.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/STRATOS/RINPA.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/STRATOS/SURIRI%20RAVEN%202.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TAIGA/TUNDRA%20KOLA%203.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TAIGA/ZAMFARA%20BAOBAB.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TAIGA/TUNDRA%2002.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE%203.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20BACALL%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20AUDREY.jpg",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20LILLIAN%20GISH.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/TOUCH/TOUCH%20AUDREY.jpg",
    ],
  ],
  'HAR': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20MARINE.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01865%20CRUST%20SAPHIRE%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01861%20CRUST%20SAND%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01868%20CRUST%20TANGERINE%20ARTISTICA-1200.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/BLINDER/image00001.jpeg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO%202.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20BOLONIA.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CARIBEAN/artistica/HAR01919%20%20%20%20CARIBBEAN%20LATTE%20OUTDOOR%20300%20CM%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CARIBEAN/artistica/HAR01922%20%20%20%20CARIBBEAN%20ONYX%20OUTDOOR%20300%20CM%20ARTISTICA-1200.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01865%20CRUST%20SAPHIRE%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01861%20CRUST%20SAND%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01868%20CRUST%20TANGERINE%20ARTISTICA-1200.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/DESERT%20GATE%20INDIGO.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/HAIMA%20MARINE%202.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/ROOTS%20PORCELAIN.jpg"

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/GOTLAND/RIVIERA.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20MACAO/buena%20calidad/HAR01465%20MACAO%20COIN%20150%20CM.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20MACAO/buena%20calidad/HAR01470%20MACAO%20ALABASTER%20150%20CM.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],

  ],
  'FLA': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(3).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20BRICK.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(4).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20%20CANVAS.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20LEAF%2006.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20FOSSIL%20(2).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(2).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(3).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/AMBOLO%20BLUEBERRY%20(2).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/ADELFAS%20MOSS(3).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/JARAPA%20(AMPLIADO).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/QUEEN%20DALHIA%20JUNIPER(2).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%2002%20(AMPLIADO).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C02%2002.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C10.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EAST%20COAST/NIAGARA%20SUNSHINE%20(2).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EAST%20COAST/JERSEY%20PUMICE%20(3).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EAST%20COAST/TIMES%20SQUARE%20AEGEAN.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/ESATER%20MEMORIES%20(AMPLIADA)(7).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20AZURE%2001.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20TANGERINE%20(2).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20C01%20%20(2).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/MOODBOARDS/MOODBOARD%20GENESIS.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20LACQUER%20RRE%20(6).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20DEEP%20TEAL(6).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20BILLBERRY(2).jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/REVOLTOSO/BORNEO.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/REVOLTOSO/IMPERIAL.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/REVOLTOSO/LUMIERE.jpg",

    ],


  ],
  'CJM': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VERANDA/VERANDA%20SUNSHINE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VERANDA/VERANDA%20EMERALD%20F1.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VERANDA/VERANDA%20EVERGREEN.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM%202.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/buena%20calidad/HAR01196%20LIENZO%20C01%20ANCHO%20280.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/buena%20calidad/HAR01278%20LIENZO%20C05%20ANCHO%20150.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/buena%20calidad/HAR01288%20LIENZO%20C78%20ANCHO%20150.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SABANNA%2001.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO%202.jpg"

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/COLONY/FIYI%20%20LAGOON.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/COLONY/TROPICAL%20LEAVES%20EVERGREEN.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/COLONY/TONGA%20PUMICE.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/MEDITERRANEAN%20STRIPES/TIRSA%20C02.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/SALT%20AND%20PEPPER/SALT%20TANGERINE.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VELVETY/VELVETY%20ALOE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VELVETY/VELVETY%20EVERGREEN.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/VELVETY/VELVETY%20LAVAROCK%202.jpg"

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/ROAD%20TO%20ASIA/BOTANICAL%20KOMORI%20MAGNESIUM.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/ROAD%20TO%20ASIA/KERANJANG%20PUMICE%20.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/ROAD%20TO%20ASIA/LINOUS%20HEMP.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20FRESCO%2001.jpg"
    ],
  ],
  'BAS': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/baja%20calidad/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS).jpg",
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/baja%20calidad/BASSARI%20KASSUMAY%20KAOLACK%20MOUTARDE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/baja%20calidad/BASSARI%20KASSUMAY%20KARABANE%20AMBRE%20ARGILE%20ET%20MOUTARDE.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/TRIBAL/Baja%20calidad/BASSARI%20TRIBAL%20DAKAR%20BOUE%20SABLE%20ET%20GRIS%20NUAGE.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/TRIBAL/Baja%20calidad/BASSARI%20TRIBAL%20DAKAR%20INDIGO.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/TRIBAL/Baja%20calidad/BASSARI%20TRIBAL%20KARITE%20AMBRE%20.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/UNIVERS/Baja%20Calidad/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE.jpg",

    ],
  ],
}



function ColeccionesMarcas({ marca }) {
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageSetsForMarca = imageSet[marca] || [];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionsByBrand = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/getCollectionsByBrand?brand=${marca}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching collections: ${response.statusText}`);
        }
        const data = await response.json();
        setColecciones(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCollectionsByBrand();
  }, [marca]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (colecciones.length === 0) {
    return <div>No collections found for {marca}</div>;
  }

  const handleCollectionClick = (coleccion) => {
    navigate(`/products?collection=${coleccion}`);
  };

  return (
    <CartProvider>
      <div className="mt-[20%] md:mt-[10%] lg:mt-[5%] xl:mt-[3%] px-5">
        <div className="flex items-center justify-center h-full pt-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mx-auto">
            Explora nuestras colecciones
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 py-5">
          {colecciones.map((coleccion, index) => (
            <div
              key={index}
              onClick={() => handleCollectionClick(coleccion)}
              className="relative group cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden bg-white w-full"
            >
              {/* Indicador de toque para móviles */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg md:hidden lg:hidden xl:hidden">
                Toca para ver
              </div>

              {/* Contenedor de texto mejorado */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 group-hover:bg-opacity-30 transition duration-300">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white text-center px-4 py-2 bg-opacity-80 rounded-md">
                  {coleccion}
                </h1>
              </div>

              {/* Mostrar el carrusel de imágenes correspondiente */}
              {imageSetsForMarca[index] && (
                <CarruselColecciones imageSets={imageSetsForMarca[index]} />
              )}
            </div>
          ))}
        </div>
      </div>



    </CartProvider>
  );
}

export default ColeccionesMarcas;