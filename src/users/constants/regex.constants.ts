// checks if a password has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// checks email
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// checks phone number
export const PHONE_NUMBER_REGEX =
  /^(\+?\d{1,4}[\s.-]?)?(\(?\d{1,4}\)?[\s.-]?)\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
