import type {
  AdoptionApplication,
  AdoptionStatus,
  UpdateAdoptionStatusInput,
} from "@/features/adocoes";

type AdoptionListResponse = {
  applications: AdoptionApplication[];
};

type AdoptionResponse = {
  application: AdoptionApplication;
};

type ErrorResponse = {
  error: string;
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ErrorResponse | null;
    throw new Error(errorBody?.error ?? "Falha ao comunicar com o servidor.");
  }

  return (await response.json()) as T;
}

export async function submitAdoptionRequest(payload: FormData): Promise<AdoptionApplication> {
  const response = await fetch("/api/adocoes", {
    method: "POST",
    body: payload,
  });

  const parsed = await parseApiResponse<AdoptionResponse>(response);
  return parsed.application;
}

export async function fetchAdoptionApplications(): Promise<AdoptionApplication[]> {
  const response = await fetch("/api/adocoes", { cache: "no-store" });
  const parsed = await parseApiResponse<AdoptionListResponse>(response);
  return parsed.applications;
}

export async function updateAdoptionStatusRequest(
  applicationId: string,
  input: UpdateAdoptionStatusInput,
): Promise<AdoptionApplication> {
  const response = await fetch(`/api/adocoes/${applicationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: input.status as AdoptionStatus }),
  });

  const parsed = await parseApiResponse<AdoptionResponse>(response);
  return parsed.application;
}
