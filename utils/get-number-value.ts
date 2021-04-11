/**
 * convert formatted currency or points into number
 * @param text formatted currency or points
 */
 export function getNumberValue(text: string) {
  return Number(text.replace(',', ''));
}

