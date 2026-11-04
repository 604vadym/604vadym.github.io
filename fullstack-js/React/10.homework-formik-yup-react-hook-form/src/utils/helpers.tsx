function safeTrim(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

export { safeTrim };
