export const phoneNumber = 51999999999;

export const formatPhoneNumber = (number: number) => {
  const str = number.toString();

  // Extraemos código de país (2 primeros dígitos para Perú)
  const countryCode = str.slice(0, 2);
  const rest = str.slice(2);

  // Formateamos en bloques de 3
  const formattedRest = rest.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  return `+${countryCode} ${formattedRest}`;
};