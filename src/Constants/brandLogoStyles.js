const BRAND_LOGO_SIZES = {
    bassari: "w-[112px] sm:w-[122px] lg:w-[144px] lg:max-h-[58px]",
    cjm: "w-[92px] sm:w-[102px] lg:w-[132px] lg:max-h-[53px]",
    default: "w-[min(205px,26vw)] sm:w-[min(215px,18vw)] lg:w-[min(158px,14vw)] lg:max-h-[39px]",
};

export const getBrandNavigationLogoClasses = (brand) =>
    BRAND_LOGO_SIZES[brand] ?? BRAND_LOGO_SIZES.default;
