import type {
  Animal,
  AnimalStatus,
  CreateAnimalInput,
  UpdateAnimalStatusInput,
} from "@/features/animais";

type AnimalListResponse = {
  animals: Animal[];
};

type AnimalResponse = {
  animal: Animal;
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

export async function fetchAnimals(options?: {
  includeNonAvailable?: boolean;
}): Promise<Animal[]> {
  const query = options?.includeNonAvailable ? "?includeNonAvailable=true" : "";
  const response = await fetch(`/api/animais${query}`, { cache: "no-store" });
  const payload = await parseApiResponse<AnimalListResponse>(response);
  return payload.animals;
}

export async function fetchAnimalById(id: string): Promise<Animal> {
  const response = await fetch(`/api/animais/${id}`, { cache: "no-store" });
  const payload = await parseApiResponse<AnimalResponse>(response);
  return payload.animal;
}

export async function createAnimalRequest(input: CreateAnimalInput): Promise<Animal> {
  const response = await fetch("/api/animais", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = await parseApiResponse<AnimalResponse>(response);
  return payload.animal;
}

export async function updateAnimalStatusRequest(
  id: string,
  input: UpdateAnimalStatusInput,
): Promise<Animal> {
  const response = await fetch(`/api/animais/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: input.status as AnimalStatus }),
  });

  const payload = await parseApiResponse<AnimalResponse>(response);
  return payload.animal;
}
