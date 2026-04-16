import type { AdoptionStatus, CreateAdoptionApplicationInput } from "@/features/adocoes";

const ALLOWED_STATUS: AdoptionStatus[] = ["pendente", "aprovada", "reprovada"];

function isNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

export function validateCreateAdoptionInput(
  input: CreateAdoptionApplicationInput,
): string | null {
  if (!isNonEmptyText(input.animalId)) {
    return "Animal selecionado e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterEmail)) {
    return "Email do adotante e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterName)) {
    return "Nome do adotante e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterCpf)) {
    return "CPF do adotante e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterPhones)) {
    return "Telefone do adotante e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterAddress)) {
    return "Endereco residencial e obrigatorio.";
  }

  if (!isNonEmptyText(input.adopterProfession)) {
    return "Profissao do adotante e obrigatoria.";
  }

  if (!isNonEmptyText(input.adoptedAnimalName)) {
    return "Nome do animal adotado e obrigatorio.";
  }

  if (!isNonEmptyText(input.adoptedAnimalAge)) {
    return "Idade do animal adotado e obrigatoria.";
  }

  if (!input.adoptedAnimalNeutered && !isNonEmptyText(input.probableNeuteringDate)) {
    return "Informe a data provavel de castracao para animal nao castrado.";
  }

  if (!isNonEmptyText(input.identityDocumentPath)) {
    return "Documento de identidade/CNH e obrigatorio.";
  }

  if (!input.acceptedLegalTerms) {
    return "A confirmacao de entendimento sobre maus-tratos e obrigatoria.";
  }

  if (!input.acceptedNeuteringCommitment) {
    return "A confirmacao de compromisso com castracao e obrigatoria.";
  }

  if (!input.acceptedVaccinationCommitment) {
    return "A confirmacao de compromisso com vacinacao e obrigatoria.";
  }

  if (!input.acceptedResponsibleAdoption) {
    return "A confirmacao de adocao responsavel e obrigatoria.";
  }

  return null;
}

export function isValidAdoptionStatus(status: string): status is AdoptionStatus {
  return ALLOWED_STATUS.includes(status as AdoptionStatus);
}
