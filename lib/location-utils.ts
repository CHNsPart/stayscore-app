export interface ParsedLocation {
  address: string;
  state: string;
  country: string;
  postalCode: string;
}

export const parseLocationString = (location: string): ParsedLocation => {
  const parts = location.split(',').map(part => part.trim());
  
  return {
    address: parts[0] || '',
    state: parts[1] || '',
    country: parts[2] || 'Canada',
    postalCode: parts[3] || ''
  };
};

export const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
] as const;

export const getProvinceLabel = (value: string): string => {
  return CANADIAN_PROVINCES.find(p => p.value === value)?.label || value;
};