import axios from 'axios';
import { translationConfig } from '../Constants/constants'; // Importar constantes desde el archivo

const translateText = async (text, targetLanguage) => {
    const response = await axios.post(
        `${translationConfig.apiUrl}?key=${translationConfig.apiKey}`,
        {
            q: text,
            target: targetLanguage,
        }
    );

    return response.data.data.translations[0].translatedText;
};

export default translateText;
