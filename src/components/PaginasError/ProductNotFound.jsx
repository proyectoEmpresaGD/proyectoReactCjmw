import { useState } from 'react';

const NoProductsFoundModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">

        {/* Contenedor de Imagen */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://img.freepik.com/foto-gratis/escenografos-trabajo_23-2149741818.jpg" // Reemplaza con la ruta real de la imagen
            alt="Persona mostrando telas"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Contenido del Modal */}
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No se han encontrado productos</h2>
          <p className="text-gray-600 mb-6">
            Lo sentimos, no hemos encontrado productos que coincidan con su búsqueda. Intente con otros términos o explore nuestras categorías.
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.href = '/products'}  // Cambia esta línea según tu lógica de redirección
              className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
            >
              Ver todos los productos
            </button>
            <button
              onClick={() => window.location.href = '/collections'}  // Cambia esta línea según tu lógica de redirección
              className="bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
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
