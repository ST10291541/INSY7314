// Email validation
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

// Password strength (min 8 chars, at least one letter and one number)
export const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?-]{8,}$/.test(String(password || ''));

// ID number validation (basic - adjust for your country)
export const isValidIDNumber = (idNumber) =>
  /^[A-Z0-9]{8,20}$/.test(String(idNumber || '').trim());

// Account number validation
export const isValidAccountNumber = (accountNumber) =>
  /^[0-9]{8,12}$/.test(String(accountNumber || '').trim());

// SWIFT code validation

// Amount validation
export const isValidAmount = (amount) =>
  /^\d+(\.\d{1,2})?$/.test(String(amount || '')) && parseFloat(amount) > 0;