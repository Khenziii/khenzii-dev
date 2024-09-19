export const formatObjectToString = (obj: object) => {
    return Object
        .entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
};

