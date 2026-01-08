export async function postForm(path: string, data: FormData) {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${base}${path}`, { method: 'POST', body: data });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
