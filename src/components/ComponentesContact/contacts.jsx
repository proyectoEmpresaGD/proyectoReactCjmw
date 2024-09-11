
import GeocodingService from "../../components/ComponentesContact/map"

function Contacts() {

    const direccionMontilla = "Calle Marqués de Larios nº58, Málaga Spain";
    const direccionMadrid = "Calle Marqués de Larios nº58, Málaga Spain";
    const direccionBarcelona = "Calle Marqués de Larios nº58, Málaga Spain";
    const direccionHolanda = "Calle Marqués de Larios nº58, Málaga Spain";

    const enviarCorreo = () => {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=pedidos@cjmw.eu'); //Reemplaza el destinatario por el correo al que le quieras enviar el gmail
    };

    const llamarNumero = (telefono) => {
        window.open(`tel:${telefono}`);
    };

    const telefonoMontilla = "+34-111-222-333"
    const telefonoMadrid = "+34-111-222-333"
    const telefonoBarcelona = "+34-111-222-333"
    const telefonoHolanda = "+34-111-222-333"
    return (
        <>
            <section className=" bg-gradient-to-r from-[#ebdecf] to-[#8a7862] xl:pt-[8%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%]  pt-[24%]">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-2xl mx-auto text-center  ">
                        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl ">Contáctanos</h2>
                    </div>

                    <div className="max-w-6xl mx-auto mt-12 overflow-hidden bg-white rounded-md shadow-md lg:mt-20">
                        <div className="grid items-stretch grid-cols-1 lg:grid-cols-5">
                            <div className="lg:col-span-3">
                                <div className="p-6 sm:p-10 bg-cover lg:h-[130vh]">
                                    <img className=" object-cover h-[80vh] sm:h-[150vh] lg:h-[120vh] xl:h-[120vh] md:h-[120vh] rounded-lg" src="https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/JARAPA%20INDIGO.jpg" alt="" />
                                </div>
                            </div>

                            <div className="bg-white lg:col-span-2">
                                <div className="h-full p-6 sm:p-10">
                                    <div className="flex flex-col justify-between h-full">
                                        <div>
                                            <h4 className="relative text-2xl font-semibold mx-auto text-center text-black">Visita nuestros showrooms</h4>

                                            <div className=' mt-8 space-y-5 mx-auto text-center '>
                                                <div className='block relative mx-auto text-center justify-center  '>
                                                    <h2 className=' relative mx-auto text-center  lg:text-3xl'><strong>MONTILLA</strong></h2>
                                                    <div className=' block mx-auto text-start mt-5 '>
                                                        <div className="mt-4 mx-auto text-center space-y-5">
                                                            <div className="flex mx-auto text-start">
                                                                <div className="flex mx-auto text-center">
                                                                    <svg className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="block ml-1 text-base text-gray-900"> Calle Marqués de Larios nº58, Málaga Spain </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-center items-center ">
                                                                <div className="flex">
                                                                    <button onClick={() => llamarNumero(telefonoMontilla)} className="flex items-center">
                                                                        <svg className="text-gray-600 w-7 h-7 hover:scale-150 transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="ml-3">
                                                                        <span className="text-base text-gray-900">+34-111-222-333</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => enviarCorreo(direccionMontilla)} className="group relative mx-auto h-12 overflow-hidden overflow-x-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50"><span className="relative z-10">Contáctenos</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='block relative mx-auto text-center justify-center '>
                                                    <h2 className=' relative mx-auto text-center lg:text-3xl'><strong>MADRID</strong></h2>
                                                    <div className=' block mx-auto text-start mt-5 '>
                                                        <div className="mt-4 mx-auto text-center space-y-5">
                                                            <div className="flex mx-auto text-start">
                                                                <div className="flex mx-auto text-center">
                                                                    <svg className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="block ml-3 text-base text-gray-900"> Calle Marqués de Larios nº58, Málaga Spain </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-center items-center ">
                                                                <div className="flex">
                                                                    <button onClick={() => llamarNumero(telefonoMadrid)} className="flex items-center">
                                                                        <svg className="text-gray-600 w-7 h-7 hover:scale-150 transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="ml-3">
                                                                        <span className="text-base text-gray-900">+34-111-222-333</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => enviarCorreo(direccionMadrid)} className="group relative mx-auto h-12 overflow-hidden overflow-x-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50"><span className="relative z-10">Contáctenos</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=' mt-8 space-y-7'>
                                                <div className='block relative mx-auto text-center justify-center '>
                                                    <h2 className=' relative mx-auto text-center lg:text-3xl'><strong>BARCELONA</strong></h2>
                                                    <div className=' block mx-auto text-start mt-5 '>
                                                        <div className="mt-4 mx-auto text-center space-y-5">
                                                            <div className="flex mx-auto text-start">
                                                                <div className="flex mx-auto text-center">
                                                                    <svg className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="block ml-3 text-base text-gray-900"> Calle Marqués de Larios nº58, Málaga Spain </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-center items-center ">
                                                                <div className="flex">
                                                                    <button onClick={() => llamarNumero(telefonoBarcelona)} className="flex items-center">
                                                                        <svg className="text-gray-600 w-7 h-7 hover:scale-150 transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="ml-3">
                                                                        <span className="text-base text-gray-900">+34-111-222-333</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => enviarCorreo(direccionBarcelona)} className="group relative mx-auto h-12 overflow-hidden overflow-x-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50"><span className="relative z-10">Contáctenos</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=' mt-8 space-y-7'>
                                                <div className='block relative mx-auto text-center justify-center '>
                                                    <h2 className=' relative mx-auto text-center lg:text-3xl '><strong>HOLANDA</strong></h2>
                                                    <div className=' block mx-auto text-start mt-5 '>
                                                        <div className="mt-4 mx-auto text-center space-y-5">
                                                            <div className="flex mx-auto text-start">
                                                                <div className="flex mx-auto text-center">
                                                                    <svg className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                    <span className="block ml-3 text-base text-gray-900"> Calle Marqués de Larios nº58, Málaga Spain </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-center items-center ">
                                                                <div className="flex">
                                                                    <button onClick={() => llamarNumero(telefonoHolanda)} className="flex items-center">
                                                                        <svg className="text-gray-600 w-7 h-7 hover:scale-150 transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="ml-3">
                                                                        <span className="text-base text-gray-900">+34-111-222-333</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => enviarCorreo(direccionHolanda)} className="group relative mx-auto h-12 overflow-hidden overflow-x-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50"><span className="relative z-10">Contáctenos</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 lg:mt-3">
                                            <hr className="border-gray-200" />
                                            <div className="flex items-center justify-between mt-7">
                                                <p className="text-lg font-semibold text-black">Siguenos en</p>

                                                <ul className="flex items-center justify-end space-x-3">
                                                    <li>
                                                        <a
                                                            href="https://twitter.com/CJMW_Official"
                                                            title=""
                                                            className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-gray-800
                                                    transition-all
                                                    duration-200
                                                    bg-transparent
                                                    border border-gray-300
                                                    rounded-full
                                                    w-7
                                                    h-7
                                                    focus:bg-blue-600
                                                    hover:text-white
                                                    focus:text-white
                                                    hover:bg-blue-600 hover:border-blue-600
                                                    focus:border-blue-600
                                                "
                                                        >
                                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path
                                                                    d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
                                                                ></path>
                                                            </svg>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a
                                                            href="www.facebook.com/cjmwfabrics"
                                                            title=""
                                                            className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-gray-800
                                                    transition-all
                                                    duration-200
                                                    bg-transparent
                                                    border border-gray-300
                                                    rounded-full
                                                    w-7
                                                    h-7
                                                    focus:bg-blue-600
                                                    hover:text-white
                                                    focus:text-white
                                                    hover:bg-blue-600 hover:border-blue-600
                                                    focus:border-blue-600
                                                "
                                                        >
                                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                                                            </svg>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a
                                                            href="https://www.instagram.com/cjmwfabrics/"
                                                            title=""
                                                            className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-gray-800
                                                    transition-all
                                                    duration-200
                                                    bg-transparent
                                                    border border-gray-300
                                                    rounded-full
                                                    w-7
                                                    h-7
                                                    focus:bg-blue-600
                                                    hover:text-white
                                                    focus:text-white
                                                    hover:bg-blue-600 hover:border-blue-600
                                                    focus:border-blue-600
                                                "
                                                        >
                                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                                                                <circle cx="16.806" cy="7.207" r="1.078"></circle>
                                                                <path
                                                                    d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"
                                                                ></path>
                                                            </svg>
                                                        </a>
                                                    </li>

                                                    <li>
                                                        <a
                                                            href="https://github.com/DavidSM14"
                                                            title=""
                                                            className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-gray-800
                                                    transition-all
                                                    duration-200
                                                    bg-transparent
                                                    border border-gray-300
                                                    rounded-full
                                                    w-7
                                                    h-7
                                                    focus:bg-blue-600
                                                    hover:text-white
                                                    focus:text-white
                                                    hover:bg-blue-600 hover:border-blue-600
                                                    focus:border-blue-600
                                                "
                                                        >
                                                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                                                                ></path>
                                                            </svg>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <GeocodingService />
        </>
    )
}
export default Contacts
