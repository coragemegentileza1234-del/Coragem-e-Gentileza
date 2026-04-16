import type { AnimalSize, AnimalSpecies, CreateAnimalInput } from "@/features/animais";

type ValidationResult =
  | { isValid: true; data: CreateAnimalInput }
  | { isValid: false; error: string };

const ALLOWED_SPECIES: AnimalSpecies[] = ["cao", "gato"];
const ALLOWED_SIZES: AnimalSize[] = ["pequeno", "medio", "grande"];

function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeTagList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export function validateCreateAnimalPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { isValid: false, error: "Payload invalido para cadastro de animal." };
  }

  const candidate = payload as Record<string, unknown>;

  if (!isNonEmptyText(candidate.name)) {
    return { isValid: false, error: "Nome do animal e obrigatorio." };
  }

  if (!ALLOWED_SPECIES.includes(candidate.species as AnimalSpecies)) {
    return { isValid: false, error: "Especie invalida. Use 'cao' ou 'gato'." };
  }

  if (!isNonEmptyText(candidate.ageLabel)) {
    return { isValid: false, error: "Idade do animal e obrigatoria." };
  }

  if (!ALLOWED_SIZES.includes(candidate.size as AnimalSize)) {
    return {
      isValid: false,
      error: "Porte invalido. Use 'pequeno', 'medio' ou 'grande'.",
    };
  }

  if (!isNonEmptyText(candidate.city)) {
    return { isValid: false, error: "Cidade do animal e obrigatoria." };
  }

  if (typeof candidate.vaccinated !== "boolean") {
    return { isValid: false, error: "Informe se o animal e vacinado." };
  }

  if (typeof candidate.neutered !== "boolean") {
    return { isValid: false, error: "Informe se o animal e castrado." };
  }

  if (!isNonEmptyText(candidate.description)) {
    return { isValid: false, error: "Descricao do animal e obrigatoria." };
  }

  if (!isNonEmptyText(candidate.imageUrl)) {
    return { isValid: false, error: "URL da imagem do animal e obrigatoria." };
  }

  const temperamentTags = normalizeTagList(candidate.temperamentTags);

  return {
    isValid: true,
    data: {
      name: candidate.name.trim(),
      species: candidate.species as AnimalSpecies,
      ageLabel: candidate.ageLabel.trim(),
      size: candidate.size as AnimalSize,
      city: candidate.city.trim(),
      vaccinated: candidate.vaccinated,
      neutered: candidate.neutered,
      description: candidate.description.trim(),
      imageUrl: candidate.imageUrl.trim(),
      temperamentTags,
    },
  };
}
