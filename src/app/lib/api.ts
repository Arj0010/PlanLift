export async function postForm(path: string, data: FormData) {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    console.error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    throw new Error("Application configuration error. Please contact support.");
  }

  try {
    const res = await fetch(`${base}${path}`, {
      method: 'POST',
      body: data,
      // Add a reasonable timeout in the future if needed via AbortController
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { error: await res.text() };
      }
      throw new Error(errorData.error || errorData.message || `API error: ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    console.error(`[api] Error posting to ${path}:`, err);
    throw err;
  }
}
