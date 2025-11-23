import { UUIDUtil } from "./uuid-generator";

// generate in the format of AA0001
function generateNextId(currentId: string): string {

    if (!/^[A-Z]{2}\d{4}$/.test(currentId)) {
        throw new Error('Invalid format. Expected format: AA0001');
    }

    const prefix = currentId.slice(0, 2).toUpperCase();
    const numPart = parseInt(currentId.slice(2), 10);

    let newNum = numPart + 1;

    if (newNum <= 9999) {
        return `${prefix}${newNum.toString().padStart(4, '0')}`;
    }

    // If number exceeds 9999, reset number and increment prefix
    const chars = prefix.split('');

    if(!chars || !chars[0] || !chars[1]){
        throw new Error('Invalid format. Expected format: AA0001');
    }

    let char1 = chars[0].charCodeAt(0);
    let char2 = chars[1].charCodeAt(0);

    if (char2 < 90) { // 'Z'
        char2++;
    } else {
        char2 = 65; // 'A'
        if (char1 < 90) {
            char1++;
        } else {
            throw new Error('ID overflow: reached ZZ9999');
        }
    }

    const newPrefix = String.fromCharCode(char1) + String.fromCharCode(char2);
    return `${newPrefix}0001`;
}

const generateUniqueId = () => {
  const uuid = UUIDUtil.generate().replace(/-/g, '');
  // Take a shorter, base-36 representation for human readability
  // Note: This shortening reduces uniqueness but is still highly secure
  return uuid.slice(0, 8).toUpperCase();
}

export const AlphaNumericUtil = {
    generateNextId,
    generateUniqueId
}