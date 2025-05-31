export const sanitizeId = (text: string): string => {
  return text
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}; 