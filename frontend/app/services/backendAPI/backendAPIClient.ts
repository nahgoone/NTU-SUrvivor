// frontend/app/services/backendApi/backendApiClient.ts

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type ApiRequestOptions<TBody> = {
  body?: TBody;
};

export async function getFromBackend<TResponse>(
  path: string,
): Promise<TResponse> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Backend GET request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function postToBackend<TBody, TResponse>(
  path: string,
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new Error(`Backend POST request failed: ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
