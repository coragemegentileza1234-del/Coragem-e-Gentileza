import { randomUUID } from "crypto";

import { readJsonFile, writeJsonFile } from "@/core/server/jsonFileStore";
import type { Animal, AnimalStatus, CreateAnimalInput } from "@/features/animais";

const ANIMAIS_FILE_PATH = "data/animais.json";

const seedAnimals: Animal[] = [
  {
    id: "luna",
    name: "Luna",
    species: "cao",
    ageLabel: "2 anos",
    size: "medio",
    city: "Criciuma, SC",
    vaccinated: true,
    neutered: true,
    description: "Calma, sociavel e gosta de criancas.",
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    temperamentTags: ["Calma", "Vacinada", "Ama criancas"],
    status: "disponivel",
    createdAt: new Date("2026-04-10T08:00:00.000Z").toISOString(),
  },
  {
    id: "thor",
    name: "Thor",
    species: "cao",
    ageLabel: "4 anos",
    size: "grande",
    city: "Icara, SC",
    vaccinated: true,
    neutered: true,
    description: "Brincalhao e companheiro para atividades ao ar livre.",
    imageUrl:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80",
    temperamentTags: ["Brincalhao", "Castrado", "Sociavel"],
    status: "disponivel",
    createdAt: new Date("2026-04-11T08:00:00.000Z").toISOString(),
  },
  {
    id: "mel",
    name: "Mel",
    species: "cao",
    ageLabel: "1 ano",
    size: "pequeno",
    city: "Criciuma, SC",
    vaccinated: false,
    neutered: false,
    description: "Docil, se adapta bem a apartamento e rotina tranquila.",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    temperamentTags: ["Filhote", "Docil", "Apartamento"],
    status: "disponivel",
    createdAt: new Date("2026-04-12T08:00:00.000Z").toISOString(),
  },
];

async function readAnimals(): Promise<Animal[]> {
  const animals = await readJsonFile<Animal[]>(ANIMAIS_FILE_PATH, []);

  if (animals.length === 0) {
    await writeJsonFile(ANIMAIS_FILE_PATH, seedAnimals);
    return seedAnimals;
  }

  return animals;
}

async function writeAnimals(animals: Animal[]): Promise<void> {
  await writeJsonFile(ANIMAIS_FILE_PATH, animals);
}

export async function listAnimals(options?: {
  includeNonAvailable?: boolean;
}): Promise<Animal[]> {
  const animals = await readAnimals();
  const includeNonAvailable = options?.includeNonAvailable ?? false;

  const filteredAnimals = includeNonAvailable
    ? animals
    : animals.filter((animal) => animal.status === "disponivel");

  return filteredAnimals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAnimalById(id: string): Promise<Animal | null> {
  const animals = await readAnimals();
  return animals.find((animal) => animal.id === id) ?? null;
}

export async function createAnimal(input: CreateAnimalInput): Promise<Animal> {
  const animals = await readAnimals();

  const animal: Animal = {
    id: randomUUID(),
    name: input.name,
    species: input.species,
    ageLabel: input.ageLabel,
    size: input.size,
    city: input.city,
    vaccinated: input.vaccinated,
    neutered: input.neutered,
    description: input.description,
    imageUrl: input.imageUrl,
    temperamentTags: input.temperamentTags,
    status: "disponivel",
    createdAt: new Date().toISOString(),
  };

  animals.push(animal);
  await writeAnimals(animals);

  return animal;
}

export async function updateAnimalStatus(
  id: string,
  status: AnimalStatus,
): Promise<Animal | null> {
  const animals = await readAnimals();
  const animalIndex = animals.findIndex((animal) => animal.id === id);

  if (animalIndex === -1) {
    return null;
  }

  const updatedAnimal: Animal = {
    ...animals[animalIndex],
    status,
  };

  animals[animalIndex] = updatedAnimal;
  await writeAnimals(animals);

  return updatedAnimal;
}
