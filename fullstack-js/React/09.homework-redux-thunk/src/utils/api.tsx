async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch data");

  return response.json() as T;
}

export { fetchData };
