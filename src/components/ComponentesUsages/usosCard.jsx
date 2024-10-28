import { careInstructions, usageInstructions } from '../../Constants/constants';  // Importar constantes

const CareInstructions = () => {
    return (
        <div className="mt-16 mb-8 px-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 pt-16 sm:pt-24">Cares</h1>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Usage Instructions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {usageInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 mt-8">Care Instructions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {careInstructions.map((instruction) => (
                    renderCard(instruction)
                ))}
            </div>
        </div>
    );
};

function renderCard(instruction) {
    return (
        <div key={instruction.id} className="flex flex-col items-center">
            <div className="h-full max-w-sm w-full bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow duration-300 ease-in-out justify-between">
                <img src={`${instruction.iconPath}`} className="h-10 w-15 mx-auto" alt={instruction.title} />
                <div>
                    <div className="font-bold text-lg mb-1 text-center pt-2">{instruction.title}</div>
                    {instruction.details.map((line, index) => (
                        <p key={index} className="text-gray-700 text-sm text-center pt-3">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CareInstructions;
