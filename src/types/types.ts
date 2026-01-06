export interface FormData {
  fullName: string;
  email: string;
  password: string;
  mobile_country_code: string;
  mobile: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  countryCode?: string;
  phoneNumber?: string;
}

export interface GlobalMessage {
  type: "success" | "error" | "";
  text: string;
}

export interface StatusMessage {
  type: "success" | "error" | "info" | "";
  text: string;
}