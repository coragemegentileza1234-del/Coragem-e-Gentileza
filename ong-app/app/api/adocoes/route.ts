import { NextRequest, NextResponse } from "next/server";

import type { AnimalSpecies } from "@/features/animais";
import { getAnimalById, updateAnimalStatus } from "@/features/animais/server/animaisRepository";
import { createAdoptionApplication, listAdoptionApplications } from "@/features/adocoes/server/adocoesRepository";
import { saveIdentityDocument } from "@/features/adocoes/server/documentStorage";
import { validateCreateAdoptionInput } from "@/features/adocoes/server/adocoesValidation";

export const runtime = "nodejs";

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, field: string): boolean {
  return readText(formData, field) === "true";
}

export async function GET() {
  const applications = await listAdoptionApplications();
  return NextResponse.json({ applications });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const animalId = readText(formData, "animalId");
    const selectedAnimal = await getAnimalById(animalId);

    if (!selectedAnimal) {
      return NextResponse.json(
        { error: "Animal selecionado nao foi encontrado." },
        { status: 404 },
      );
    }

    const identityDocument = formData.get("identityDocument");

    if (!(identityDocument instanceof File) || identityDocument.size === 0) {
      return NextResponse.json(
        { error: "Documento de identidade/CNH e obrigatorio." },
        { status: 400 },
      );
    }

    const identityDocumentPath = await saveIdentityDocument(identityDocument);

    const payload = {
      animalId,
      adopterEmail: readText(formData, "adopterEmail"),
      adopterName: readText(formData, "adopterName"),
      adopterCpf: readText(formData, "adopterCpf"),
      adopterPhones: readText(formData, "adopterPhones"),
      adopterAddress: readText(formData, "adopterAddress"),
      adopterProfession: readText(formData, "adopterProfession"),
      adoptedAnimalName:
        readText(formData, "adoptedAnimalName") || selectedAnimal.name,
      adoptedAnimalSpecies:
        (readText(formData, "adoptedAnimalSpecies") as AnimalSpecies) ||
        selectedAnimal.species,
      adoptedAnimalAge: readText(formData, "adoptedAnimalAge") || selectedAnimal.ageLabel,
      adoptedAnimalVaccinated: readBoolean(formData, "adoptedAnimalVaccinated"),
      adoptedAnimalNeutered: readBoolean(formData, "adoptedAnimalNeutered"),
      probableNeuteringDate: readText(formData, "probableNeuteringDate"),
      identityDocumentPath,
      acceptedLegalTerms: readBoolean(formData, "acceptedLegalTerms"),
      acceptedNeuteringCommitment: readBoolean(
        formData,
        "acceptedNeuteringCommitment",
      ),
      acceptedVaccinationCommitment: readBoolean(
        formData,
        "acceptedVaccinationCommitment",
      ),
      acceptedResponsibleAdoption: readBoolean(
        formData,
        "acceptedResponsibleAdoption",
      ),
    };

    const validationError = validateCreateAdoptionInput(payload);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const application = await createAdoptionApplication(payload);
    await updateAnimalStatus(animalId, "processo_adocao");

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha inesperada.";

    return NextResponse.json(
      { error: `Nao foi possivel enviar a solicitacao. ${message}` },
      { status: 500 },
    );
  }
}
