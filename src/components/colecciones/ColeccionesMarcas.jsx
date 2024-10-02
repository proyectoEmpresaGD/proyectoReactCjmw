import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CartProvider } from '../CartContext';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
const imageSet = {
  'ARE': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/ATMOSPHERE%20MOSS_3_11zon_7_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20BLOSSOM_4_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20SHELL_5_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/STORM%20DUSK_1_11zon_5_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20NOIR%202_10_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MOODBOARD/MOOD%20BOARD%20TOUCH%202_12_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20BURNT%20ORANGE_5_11zon_4_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY%202_8_11zon_9_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY%203_9_11zon_10_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/MONTECARLO%20RUBY%204_4_11zon_5_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/DUNE%20SAHARA_5_11zon_4_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/DUNE%20PATAGONIA_4_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/AMASTISTA%20ALOE_7_11zon_6_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20NOIR%202_10_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MOODBOARD/MOOD%20BOARD%20TOUCH%202_12_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20BURNT%20ORANGE_5_11zon_4_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%202_6_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20NORDIC%20BLUE_4_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%203_1_11zon_6_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20NOIR%202_10_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MOODBOARD/MOOD%20BOARD%20TOUCH%202_12_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20BURNT%20ORANGE_5_11zon_4_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20NOIR%202_10_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MOODBOARD/MOOD%20BOARD%20TOUCH%202_12_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20BURNT%20ORANGE_5_11zon_4_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20LINEN%20(2)%20(2)%20(2)_9_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/CAPRI%20SPRING%20GREEN%20jpg_6_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/PADDINGTON_3_11zon_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/COJINES%20MONTANA_5_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/MAKALU%20RAVEN%20_7_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/YELLOWSTONE%20PORCELAIN_3_11zon_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/HABITAT%20SAND_8_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/LUNAR%20BURGUNDY_9_11zon_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/NOMAD%20BURGUNDY%203_10_11zon_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN%202_4_11zon_4_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN_6_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/SMOKE%20ASH_3_11zon_3_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/SHROUD%20WHITE_18_11zon_14_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/TRELLIS%20OFF%20WHITE_6_11zon_2_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET_1_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET(1)_3_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/RUSTICA/RUSTICA_2_11zon_3_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STONE/STONE%20CANAIMA_3_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STONE/STONE%20TRANGO_1_11zon_1_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/ANTILLA%20VELVET%20C%2003_4_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/RINPA_10_11zon_7_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/SURIRI%20RAVEN%202_11_11zon_8_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/TUNDRA%20KOLA%202_14_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/ZAMFARA%20BAOBAB_4_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/TUNDRA%2002_10_11zon_7_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE%203_4_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20BACALL%202_9_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20AUDREY_8_11zon_1_11zon.webp",
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20LILLIAN%20GISH_6_11zon_8_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE_5_11zon_7_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20AUDREY_8_11zon_1_11zon.webp",
    ],
  ],
  'HAR': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20MARINE_2_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01865%20CRUST%20SAPHIRE%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01861%20CRUST%20SAND%20ARTISTICA-1200.jpg",
      "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01868%20CRUST%20TANGERINE%20ARTISTICA-1200.jpg"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/BARENTS%20ROYAL%20BLUE_7_11zon_1_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/BLINDER/image00004_2_11zon_3_11zon.webp",

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO_5_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO%202_4_11zon_5_11zon.webp"
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
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/HAIMA%20MARINE%202_1_11zon_4_11zon.webp",
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
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(4)_13_11zon_9_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20BRICK_14_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(3)_12_11zon_8_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20%20CANVAS_7_11zon_4_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20LEAF%20(2)_2_11zon_9_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20FOSSIL%20(2)_10_11zon_7_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(2)_3_11zon_7_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(3)_4_11zon_8_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/AMBOLO%20BLUEBERRY%20(2)_6_11zon_1_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/ADELFAS%20MOSS%20(3)_4_11zon_25_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/JARAPA%20(AMPLIADO)_20_11zon_12_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/QUEEN%20DAHLIA%20JUNIPER%20(2)_32_11zon_24_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%2002%20(AMPLIADO)_3_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C02%2002_6_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C02%20%20(3)_5_11zon_2_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/NIAGARA%20SUNSHINE%20(2)_4_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/JERSEY%20PUMICE%20(3)_3_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/TIMES%20SQUARE%20AEGEAN_1_11zon_5_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/ESATER%20MEMORIES%20(AMPLIADA)(7)_5_11zon_7_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20AZURE%2001_12_11zon_14_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20TANGERINE%20(2)_13_11zon_15_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20C01%20%20(2)_4_11zon_13_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/MOODBOARDS/MOODBOARD%20GENESIS_2_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20LACQUER%20RRE%20(6)_14_11zon_23_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20BILLBERRY(2)_4_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20DEEP%20TEAL(6)_5_11zon_1_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/BORNEO_3_11zon_28_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/IMPERIAL_4_11zon_29_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/LUMIERE_8_11zon_3_11zon.webp",

    ],


  ],
  'CJM': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20EVERGREEN_4_11zon_6_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20EMERALD%20F1_3_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20SUNSHINE%202_6_11zon_2_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px_1_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ROKKI%20PUMICE_7_11zon_10_11zon.webp",

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM%202_2_11zon_4_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM_3_11zon_1_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2_11_11zon_4_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/buena%20calidad/HAR01196%20LIENZO%20C01%20ANCHO%20280.jpg",

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SABANNA%2001_3_11zon_3_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO_4_1.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO%202_3_4.webp"

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/COLONY/FIYI%20%20LAGOON_13_11zon_16_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/COLONY/TROPICAL%20LEAVES%20EVERGREEN_12_11zon_15_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/COLONY/TONGA%20PUMICE_10_11zon_13_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2_11_11zon_4_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MEDITERRANEAN%20STRIPES/TIRSA%20C02_1_11zon_2_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/SALT%20TANGERINE_1_11zon_1_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20ALOE_9_11zon_1_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20EVERGREEN_2_11zon_5_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20LAVAROCK%202_5_11zon_8_11zon.webp"

    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/ROAD%20TO%20ASIA/BOTANICAL%20KOMORI%20MAGNESIUM_7_11zon_4_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/ROAD%20TO%20ASIA/VANUATU%20BLOSSOM%202_3_11zon_29_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/ROAD%20TO%20ASIA/LINOUS%20HEMP_19_11zon_16_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20FRESCO%2001_2_11zon_2_11zon.webp"
    ],
  ],
  'BAS': [
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS)_3_11zon_3_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20KAOLACK%20MOUTARDE_2_11zon_9_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20KARABANE%20AMBRE%20ARGILE%20ET%20MOUTARDE_3_11zon_10_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20DAKAR%20BOUE%20SABLE%20ET%20GRIS%20NUAGE_6_11zon_11_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20DAKAR%20INDIGO_3_11zon_2_11zon.webp",
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20KARITE%20AMBRE%20_2_11zon_13_11zon.webp"
    ],
    [
      "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/UNIVERS/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE_11zon_11zon_11zon.webp",

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
        <div className="flex items-center justify-center h-full pt-7">
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