export const NAME_PATTERN = "^[A-Za-z][A-Za-z .\\'\\-]{1,49}$";
export const PHONE_PATTERN = "^(?:\\+[1-9]\\d{7,14}|\\d{7,15})$";

export const NAME_TITLE = "Use 2 to 50 letters. Spaces, dots, apostrophes, and hyphens are allowed.";
export const PHONE_TITLE = "Use a valid phone number with or without country code, like +8801234567890 or 01234567890.";
export const MESSAGE_TITLE = "Please enter at least 10 characters.";

export const sanitizeNameInput = (value: string) => value.replace(/\s{2,}/g, " ").slice(0, 50);

export const sanitizePhoneInput = (value: string) =>
  value
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "")
    .slice(0, value.startsWith("+") ? 16 : 15);
