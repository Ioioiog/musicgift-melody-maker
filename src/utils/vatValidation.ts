
const vatRegexMap: Record<string, RegExp> = {
  RO: /^RO\d{2,10}$/,                            // România
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,              // Franța
  DE: /^DE\d{9}$/,                               // Germania
  PL: /^PL\d{10}$/,                              // Polonia
  GB: /^GB(\d{9}|\d{12}|(GD|HA)\d{3})$/,         // UK
  IT: /^IT\d{11}$/                               // Italia
};

export const isValidVatFormat = (vatCode: string): boolean => {
  const cleaned = vatCode.trim().toUpperCase();
  const countryCode = cleaned.slice(0, 2);
  const regex = vatRegexMap[countryCode];
  return !!regex && regex.test(cleaned);
};

export const getVatValidationError = (vatCode: string): string | null => {
  if (!vatCode || vatCode.length < 4) return 'Cod TVA prea scurt';
  if (!isValidVatFormat(vatCode)) return 'Cod TVA invalid pentru țara selectată';
  return null;
};

export const getSupportedVatCountries = (): string[] => {
  return Object.keys(vatRegexMap);
};
