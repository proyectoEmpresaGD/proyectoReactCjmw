const scrollToLocation = (locationId) => {
    const element = document.getElementById(locationId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
export default scrollToLocation