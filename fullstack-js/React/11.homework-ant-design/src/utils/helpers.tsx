function safeTrim(value: string): string;
function safeTrim<T>(value: T): T;
function safeTrim(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

export { safeTrim };
