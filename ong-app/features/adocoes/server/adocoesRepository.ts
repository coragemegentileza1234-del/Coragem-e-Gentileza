import { randomUUID } from "crypto";

import { readJsonFile, writeJsonFile } from "@/core/server/jsonFileStore";
import type {
  AdoptionApplication,
  AdoptionStatus,
  CreateAdoptionApplicationInput,
} from "@/features/adocoes";

const ADOCOES_FILE_PATH = "data/adocoes.json";

async function readAdocoes(): Promise<AdoptionApplication[]> {
  return readJsonFile<AdoptionApplication[]>(ADOCOES_FILE_PATH, []);
}

async function writeAdocoes(applications: AdoptionApplication[]): Promise<void> {
  await writeJsonFile(ADOCOES_FILE_PATH, applications);
}

export async function listAdoptionApplications(): Promise<AdoptionApplication[]> {
  const applications = await readAdocoes();
  return applications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getAdoptionApplicationById(
  id: string,
): Promise<AdoptionApplication | null> {
  const applications = await readAdocoes();
  return applications.find((application) => application.id === id) ?? null;
}

export async function createAdoptionApplication(
  input: CreateAdoptionApplicationInput,
): Promise<AdoptionApplication> {
  const applications = await readAdocoes();

  const application: AdoptionApplication = {
    id: randomUUID(),
    animalId: input.animalId,
    adopterEmail: input.adopterEmail,
    adopterName: input.adopterName,
    adopterCpf: input.adopterCpf,
    adopterPhones: input.adopterPhones,
    adopterAddress: input.adopterAddress,
    adopterProfession: input.adopterProfession,
    adoptedAnimalName: input.adoptedAnimalName,
    adoptedAnimalSpecies: input.adoptedAnimalSpecies,
    adoptedAnimalAge: input.adoptedAnimalAge,
    adoptedAnimalVaccinated: input.adoptedAnimalVaccinated,
    adoptedAnimalNeutered: input.adoptedAnimalNeutered,
    probableNeuteringDate: input.probableNeuteringDate,
    identityDocumentPath: input.identityDocumentPath,
    acceptedLegalTerms: input.acceptedLegalTerms,
    acceptedNeuteringCommitment: input.acceptedNeuteringCommitment,
    acceptedVaccinationCommitment: input.acceptedVaccinationCommitment,
    acceptedResponsibleAdoption: input.acceptedResponsibleAdoption,
    status: "pendente",
    createdAt: new Date().toISOString(),
  };

  applications.push(application);
  await writeAdocoes(applications);

  return application;
}

export async function updateAdoptionApplicationStatus(
  id: string,
  status: AdoptionStatus,
): Promise<AdoptionApplication | null> {
  const applications = await readAdocoes();
  const applicationIndex = applications.findIndex((application) => application.id === id);

  if (applicationIndex === -1) {
    return null;
  }

  const updatedApplication: AdoptionApplication = {
    ...applications[applicationIndex],
    status,
  };

  applications[applicationIndex] = updatedApplication;
  await writeAdocoes(applications);

  return updatedApplication;
}
