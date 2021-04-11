export function addMessage(message: string): void;

export function addMessage(
  message: { title: string; value: any },
  moveToTop?: boolean,
): void;
