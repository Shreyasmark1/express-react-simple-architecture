const isString = (value: any): value is string => typeof value === "string" || value instanceof String;

const isNotEmpty = (value: any): value is string => {
    return value && isString(value) && value.trim() !== '';
};

const isEmpty = (value: any): value is null | undefined => !isNotEmpty(value);

export const StringUtils = {
    isString,
    isNotEmpty,
    isEmpty
}
