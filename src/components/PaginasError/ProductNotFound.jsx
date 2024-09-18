import { useState } from 'react';

const NoProductsFoundModal = () => {
  const [hoveredSide, setHoveredSide] = useState(null); // Controlar cuál texto está siendo hovered

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full flex flex-col md:flex-row items-center relative overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0 transition-transform duration-500"
          style={{
            transform:
              hoveredSide === 'left' ? 'translateX(50%)' : hoveredSide === 'right' ? 'translateX(-50%)' : 'translateX(0)',
          }}
        >
          <img
            src="https://img.freepik.com/foto-gratis/escenografos-trabajo_23-2149741818.jpg" // Reemplaza con la ruta real de la imagen
            alt="Persona mostrando telas"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenedor del contenido */}
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between text-center">
          {/* Texto izquierdo */}
          <div
            className={`w-full md:w-1/2 p-4 transition-all duration-500`}
            onMouseEnter={() => setHoveredSide('left')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No se han encontrado productos</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Lo sentimos, no hemos encontrado productos que coincidan con su búsqueda.
              Intente con otros términos o explore nuestras categorías.
            </p>
            <button
              onClick={() => window.location.href = '/products'}  // Cambia esta línea según tu lógica de redirección
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 md:px-6 rounded-full hover:from-blue-600 hover:to-blue-800 transition duration-300"
            >
              Ver todos los productos
            </button>
          </div>

          {/* Texto derecho */}
          <div
            className={`w-full md:w-1/2 p-4 transition-all duration-500`}
            onMouseEnter={() => setHoveredSide('right')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Explora nuestra colección</h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Tenemos una gran variedad de productos textiles para ti. Navega entre nuestras diferentes categorías y encuentra lo que necesitas.
            </p>
            <button
              onClick={() => window.location.href = '/collections'}  // Cambia esta línea según tu lógica de redirección
              className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 px-4 md:px-6 rounded-full hover:from-green-600 hover:to-green-800 transition duration-300"
            >
              Explorar Colecciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoProductsFoundModal;
