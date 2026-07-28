export const OUTDOOR_INTERNAL_VALUE = 'OUTDOOR';
export const OUTDOOR_DISPLAY_VALUE = 'OUTDOOR-INDOOR';

export const getUsageDisplayValue = (value) => {
    if (value === null || value === undefined) return value;

    const rawValue = String(value);
    return rawValue
        .split(';')
        .map(part => (
            part.trim().toUpperCase() === OUTDOOR_INTERNAL_VALUE
                ? OUTDOOR_DISPLAY_VALUE
                : part.trim()
        ))
        .join('; ');
};

export const getSingleUsageDisplayValue = (value) => {
    if (value === null || value === undefined) return value;
    return String(value).trim().toUpperCase() === OUTDOOR_INTERNAL_VALUE
        ? OUTDOOR_DISPLAY_VALUE
        : String(value).trim();
};
