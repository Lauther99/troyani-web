/**
 * Validación del RUC peruano (wireframe pág. 15):
 * 11 dígitos, prefijo 10, 15, 16, 17 o 20; dígito verificador módulo 11
 * con pesos 5, 4, 3, 2, 7, 6, 5, 4, 3, 2 sobre los 10 primeros dígitos.
 */
const PESOS_RUC = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const;
const PREFIJOS_RUC = ["10", "15", "16", "17", "20"] as const;

export function validarRuc(valor: string): { valido: boolean; error?: string } {
  const limpio = valor.trim();
  if (!limpio) {
    return { valido: false, error: "Ingresa los 11 dígitos del RUC (empieza con 10 o 20)." };
  }
  if (!/^\d{11}$/.test(limpio)) {
    return { valido: false, error: "El RUC debe tener exactamente 11 dígitos numéricos." };
  }
  const prefijo = limpio.slice(0, 2);
  if (!PREFIJOS_RUC.includes(prefijo as (typeof PREFIJOS_RUC)[number])) {
    return { valido: false, error: "El RUC debe empezar con 10, 15, 16, 17 o 20." };
  }
  const suma = PESOS_RUC.reduce((acc, peso, i) => acc + Number(limpio[i]) * peso, 0);
  const resto = 11 - (suma % 11);
  const digito = resto === 10 ? 0 : resto === 11 ? 1 : resto;
  if (digito !== Number(limpio[10])) {
    return { valido: false, error: "El RUC ingresado no es válido; verifica el último dígito." };
  }
  return { valido: true };
}
