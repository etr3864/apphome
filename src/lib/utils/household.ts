// Generate a random 6-digit household code
export const generateHouseholdCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format household code for display (e.g., "748-392")
export const formatHouseholdCode = (code: string): string => {
  if (code.length !== 6) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
};

