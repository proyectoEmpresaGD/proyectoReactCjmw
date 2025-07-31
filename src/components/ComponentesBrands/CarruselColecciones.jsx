import { carruselConfig } from '../../Constants/constants'; // Importar las constantes

const CarruselColecciones = ({ imageUrl }) => {

  return (
    <div className="h-[35vh] sm:h-[50vh] md:h-[40vh] lg:h-[50vh] w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] bg-cover mx-auto flex justify-center items-center">
      {imageUrl ? (
        <div className="h-full w-full rounded-md overflow-hidden">
          <div className="image-container h-full w-full object-cover rounded-md mx-auto">
            <img
              src={imageUrl}
              alt="Imagen colección"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        </div>
      ) : (
        <p>{carruselConfig.noImagesText}</p> // Usar el texto de error desde las constantes
      )}
    </div>
  );
};

export default CarruselColecciones;
