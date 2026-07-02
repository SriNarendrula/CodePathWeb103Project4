export const checkFeatureCombinations = (selections) => {
    const { trim, roofType } = selections;

    if (trim === 'Track Edition' && roofType === 'Convertible') {
        return {
            isValid: false,
            reason: "The Track Edition structural package is incompatible with a convertible soft-top roof."
        };
    }

    return { isValid: true, reason: "" };
};