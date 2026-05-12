/**
 * Returns true if value is a single character 0-9
 */
export function isValidOTPDigit(value: string): boolean {
  return /^[0-9]$/.test(value);
}

/**
 * Extracts numeric characters from text.
 * Returns 6-digit string if exactly 6 numeric chars extracted, null otherwise.
 */
export function extractOTPFromPaste(text: string): string | null {
  const digits = text.replace(/[^0-9]/g, "");
  return digits.length === 6 ? digits : null;
}
