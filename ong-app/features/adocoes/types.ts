import type { AnimalSpecies } from "@/features/animais";

export type AdoptionStatus = "pendente" | "aprovada" | "reprovada";

export type AdoptionApplication = {
  id: string;
  animalId: string;
  adopterEmail: string;
  adopterName: string;
  adopterCpf: string;
  adopterPhones: string;
  adopterAddress: string;
  adopterProfession: string;
  adoptedAnimalName: string;
  adoptedAnimalSpecies: AnimalSpecies;
  adoptedAnimalAge: string;
  adoptedAnimalVaccinated: boolean;
  adoptedAnimalNeutered: boolean;
  probableNeuteringDate: string;
  identityDocumentPath: string;
  acceptedLegalTerms: boolean;
  acceptedNeuteringCommitment: boolean;
  acceptedVaccinationCommitment: boolean;
  acceptedResponsibleAdoption: boolean;
  status: AdoptionStatus;
  createdAt: string;
};

export type UpdateAdoptionStatusInput = {
  status: AdoptionStatus;
};

export type CreateAdoptionApplicationInput = {
  animalId: string;
  adopterEmail: string;
  adopterName: string;
  adopterCpf: string;
  adopterPhones: string;
  adopterAddress: string;
  adopterProfession: string;
  adoptedAnimalName: string;
  adoptedAnimalSpecies: AnimalSpecies;
  adoptedAnimalAge: string;
  adoptedAnimalVaccinated: boolean;
  adoptedAnimalNeutered: boolean;
  probableNeuteringDate: string;
  identityDocumentPath: string;
  acceptedLegalTerms: boolean;
  acceptedNeuteringCommitment: boolean;
  acceptedVaccinationCommitment: boolean;
  acceptedResponsibleAdoption: boolean;
};
