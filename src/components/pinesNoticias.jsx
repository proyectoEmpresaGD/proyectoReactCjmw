import { Link } from 'react-router-dom';

const Works = () => {
    return (
        <div id="aboutUs" className="p-8 xl:p-20">
            <div className="mb-8">
                <h1 className="text-[40px] font-black text-center">
                    We create world-class digital products
                </h1>
                <p className="text-xl text-gray-500 text-center">
                    By providing information about design to the world's best instructors, we help others to create amazing products.
                </p>
            </div>
            {/* Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {/* Noticia 1: "Últimas tendencias en telas naturales" */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        {/* Aquí puedes colocar la imagen relacionada con la noticia */}
                        <img
                            src="imagen_tendencias_telas_naturales.jpg"
                            alt="Últimas tendencias en telas naturales"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <Link to="/BlogHome" className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</Link>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">March 20, 2024</p>
                    <h3 className="text-2xl font-bold text-center">Últimas tendencias en telas naturales</h3>
                    <p className="text-gray-500 text-center">
                        Descubre las últimas tendencias en telas naturales y cómo están impactando en la industria textil.
                    </p>
                </div>
                {/* Noticia 2: "Innovaciones tecnológicas en la fabricación textil" */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        {/* Aquí puedes colocar la imagen relacionada con la noticia */}
                        <img
                            src="imagen_innovaciones_tecnologicas_textiles.jpg"
                            alt="Innovaciones tecnológicas en la fabricación textil"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <Link to="/BlogHome" className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</Link>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">April 5, 2024</p>
                    <h3 className="text-2xl font-bold text-center">Innovaciones tecnológicas en la fabricación textil</h3>
                    <p className="text-gray-500 text-center">
                        Conoce las últimas innovaciones tecnológicas que están revolucionando la fabricación de textiles en la industria.
                    </p>
                </div>
                {/* Noticia 3: "Impacto ambiental de la industria textil" */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        {/* Aquí puedes colocar la imagen relacionada con la noticia */}
                        <img
                            src="imagen_impacto_ambiental_industria_textil.jpg"
                            alt="Impacto ambiental de la industria textil"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <Link to="/BlogHome" className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</Link>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">April 12, 2024</p>
                    <h3 className="text-2xl font-bold text-center">Impacto ambiental de la industria textil</h3>
                    <p className="text-gray-500 text-center">
                        Examina el impacto ambiental de la industria textil y las medidas que se están tomando para reducirlo.
                    </p>
                </div>
                {/* Noticia 4: "Nuevas técnicas de teñido y estampado" */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        {/* Aquí puedes colocar la imagen relacionada con la noticia */}
                        <img
                            src="imagen_nuevas_tecnicas_tenido_estampado.jpg"
                            alt="Nuevas técnicas de teñido y estampado"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <Link to="/BlogHome" className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</Link>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">April 18, 2024</p>
                    <h3 className="text-2xl font-bold text-center">Nuevas técnicas de teñido y estampado</h3>
                    <p className="text-gray-500 text-center">
                        Descubre las nuevas técnicas de teñido y estampado que están marcando tendencia en el mundo de la moda.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Works;
