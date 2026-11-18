export async function safeFetchJson<T = Record<string, any>>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ res: Response; data: T }> {
  const res = await fetch(input, {
    cache: 'no-store',
    ...init,
  });
  const text = await res.text();
  if (!text || !text.trim()) {
    if (!res.ok) {
      throw new Error(`Request failed (HTTP ${res.status}) with an empty response.`);
    }
    return { res, data: {} as T };
  }
  try {
    const data = JSON.parse(text) as T;
    return { res, data };
  } catch {
    throw new Error(
      `Unexpected server response (HTTP ${res.status}). Please refresh and try again.`
    );
  }
}
