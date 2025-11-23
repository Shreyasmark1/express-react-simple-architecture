type DoubtfullString = any | undefined | unknown | null

const isString = (val: DoubtfullString): boolean => typeof val === "string"
const isNotString = (val: DoubtfullString) => !isString(val)

const isEmpty = (val: DoubtfullString): val is null | undefined => isString(val) && val.trim() !== ''
const isNotEmpty = (val: DoubtfullString) => !isEmpty(val)

const trim = (val: DoubtfullString) => isString(val) ? val.trim() : ""

function slugify(str: string) {

    if (isEmpty(str)) return "";

    return str
        .toLowerCase() // Convert the string to lowercase
        .trim() // Remove leading/trailing whitespace
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters (except spaces and hyphens)
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

function getInitials(name: string) {

    if (StringUtils.isEmpty(name)) return '';

    // Split the name into parts divided by spaces
    const parts = name.trim().split(' ');

    // Return empty string if no valid name
    if (parts.length === 0 || !parts[0] || !parts[0][0]) return '';

    // Get first letter of first word
    let initials = parts[0][0].toUpperCase();

    // If there are multiple words, add first letter of second word
    if (parts.length > 1 && parts[1] && parts[1][0]) {
        initials += parts[1][0].toUpperCase();
    }

    return initials;
}

export const StringUtils = {
    isString,
    isNotString,
    isNotEmpty,
    isEmpty,
    trim,
    slugify,
    getInitials
}
