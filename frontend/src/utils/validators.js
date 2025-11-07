export const patterns = {
  fullName: /^[A-Za-z\s]+$/,
  idNumber: /^[0-9]{13}$/,
  accountNumber: /^[0-9]{10,12}$/,
  passwordMinLen: 8,
  payeeAccount: /^[0-9]{10,12}$/,
  provider: /^[A-Za-z\s]+$/,
  swift: /^[A-Z0-9]{8,11}$/
};

export function validateRegister({ fullName, idNumber, accountNumber, password }) {
  if (!patterns.fullName.test(fullName)) return "Name must contain letters and spaces only.";
  if (!patterns.idNumber.test(idNumber)) return "ID must be 13 digits.";
  if (!patterns.accountNumber.test(accountNumber)) return "Account number must be 10-12 digits.";
  if (!password || password.length < patterns.passwordMinLen) return `Password must be at least ${patterns.passwordMinLen} characters.`;
  return null;
}

export function validatePayment({ amount, currency, provider, payeeAccount, swiftCode }) {
  if (!amount || Number(amount) <= 0) return "Amount must be greater than 0.";
  if (!["USD","ZAR","GBP","EUR"].includes(currency)) return "Invalid currency.";
  if (!patterns.provider.test(provider)) return "Provider invalid.";
  if (!patterns.payeeAccount.test(payeeAccount)) return "Payee account invalid.";
  if (!patterns.swift.test(swiftCode)) return "SWIFT code invalid (8-11 uppercase letters/numbers).";
  return null;
}
