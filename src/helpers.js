export function validateName(name) {
  const re = /^[a-z]+(([',.-][a-z ]| [a-z])?[a-zA-Z]*)$/i;
  return re.test(String(name));
}

export function validatePhoneNumber(number) {
  let isValid = false;
  // International number
  let re = /^\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  if (re.test(String(number)))
    isValid = true;

  // Local (morocco) numer
  re = /^0[5-7]([-. ]?[0-9]{2}){4}$/;
  if (re.test(String(number)))
    isValid = true;

  return isValid;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password));
}

export function toISO(format) {
  // format: DDMMYYHHmm
  if (format.length !== 10)
    return null;

  const day = format.substr(0, 2);
  const month = format.substr(2, 2);
  const year = "20" + format.substr(4, 2);
  const hour = format.substr(6, 2);
  const minute = format.substr(8, 2);
  return [year, month, day].join("-") +
    "T" + [hour, minute].join(":");
}
