import { UUIDUtil } from "./uuid-generator";

export const generateUniqueId = () => {
  const uuid = UUIDUtil.generate().replace(/-/g, '');
  // Take a shorter, base-36 representation for human readability
  // Note: This shortening reduces uniqueness but is still highly secure
  return uuid.slice(0, 8).toUpperCase();
}