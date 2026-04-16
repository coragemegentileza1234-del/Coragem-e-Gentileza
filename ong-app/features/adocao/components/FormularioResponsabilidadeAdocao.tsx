"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { submitAdoptionRequest } from "@/features/adocoes";
import { fetchAnimals, type Animal } from "@/features/animais";

type ConsentAnswer = "" | "sim" | "nao";

type FormState = {
  adopterEmail: string;
  adopterName: string;
  adopterCpf: string;
  adopterPhones: string;
  adopterAddress: string;
  adopterProfession: string;
  probableNeuteringDate: string;
};

const initialFormState: FormState = {
  adopterEmail: "",
  adopterName: "",
  adopterCpf: "",
  adopterPhones: "",
  adopterAddress: "",
  adopterProfession: "",
  probableNeuteringDate: "",
};

export default function FormularioResponsabilidadeAdocao() {
  const searchParams = useSearchParams();
  const selectedAnimalIdFromUrl = searchParams.get("animalId") ?? "";

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("");
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [acceptedLegalTerms, setAcceptedLegalTerms] = useState<ConsentAnswer>("");
  const [acceptedNeuteringCommitment, setAcceptedNeuteringCommitment] =
    useState<ConsentAnswer>("");
  const [acceptedVaccinationCommitment, setAcceptedVaccinationCommitment] =
    useState<ConsentAnswer>("");
  const [acceptedResponsibleAdoption, setAcceptedResponsibleAdoption] =
    useState<ConsentAnswer>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAnimals() {
      try {
        setIsLoadingAnimals(true);
        const availableAnimals = await fetchAnimals();

        if (!isActive) {
          return;
        }

        setAnimals(availableAnimals);

        if (availableAnimals.length === 0) {
          setSelectedAnimalId("");
          return;
        }

        const foundAnimalFromUrl = availableAnimals.find(
          (animal) => animal.id === selectedAnimalIdFromUrl,
        );

        if (foundAnimalFromUrl) {
          setSelectedAnimalId(foundAnimalFromUrl.id);
          return;
        }

        setSelectedAnimalId((current) => current || availableAnimals[0].id);
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Nao foi possivel carregar os animais para adocao.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoadingAnimals(false);
        }
      }
    }

    void loadAnimals();

    return () => {
      isActive = false;
    };
  }, [selectedAnimalIdFromUrl]);

  const selectedAnimal = useMemo(
    () => animals.find((animal) => animal.id === selectedAnimalId) ?? null,
    [animals, selectedAnimalId],
  );

  const requiresProbableNeuteringDate =
    selectedAnimal !== null && selectedAnimal.neutered === false;

  function updateFormField(field: keyof FormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAnimal) {
      setErrorMessage("Selecione um animal valido para continuar.");
      return;
    }

    if (!identityDocument) {
      setErrorMessage("Envie a foto ou arquivo da identidade/CNH para continuar.");
      return;
    }

    setErrorMessage(null);
    setSuccessProtocol(null);
    setIsSubmitting(true);

    const payload = new FormData();

    payload.append("animalId", selectedAnimal.id);
    payload.append("adopterEmail", formState.adopterEmail);
    payload.append("adopterName", formState.adopterName);
    payload.append("adopterCpf", formState.adopterCpf);
    payload.append("adopterPhones", formState.adopterPhones);
    payload.append("adopterAddress", formState.adopterAddress);
    payload.append("adopterProfession", formState.adopterProfession);
    payload.append("adoptedAnimalName", selectedAnimal.name);
    payload.append("adoptedAnimalSpecies", selectedAnimal.species);
    payload.append("adoptedAnimalAge", selectedAnimal.ageLabel);
    payload.append("adoptedAnimalVaccinated", String(selectedAnimal.vaccinated));
    payload.append("adoptedAnimalNeutered", String(selectedAnimal.neutered));
    payload.append("probableNeuteringDate", formState.probableNeuteringDate);
    payload.append("acceptedLegalTerms", String(acceptedLegalTerms === "sim"));
    payload.append(
      "acceptedNeuteringCommitment",
      String(acceptedNeuteringCommitment === "sim"),
    );
    payload.append(
      "acceptedVaccinationCommitment",
      String(acceptedVaccinationCommitment === "sim"),
    );
    payload.append(
      "acceptedResponsibleAdoption",
      String(acceptedResponsibleAdoption === "sim"),
    );
    payload.append("identityDocument", identityDocument);

    try {
      const application = await submitAdoptionRequest(payload);

      setSuccessProtocol(application.id);
      setFormState(initialFormState);
      setIdentityDocument(null);
      setAcceptedLegalTerms("");
      setAcceptedNeuteringCommitment("");
      setAcceptedVaccinationCommitment("");
      setAcceptedResponsibleAdoption("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel enviar a solicitacao de adocao.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-6 py-10 text-slate-800">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#eadfcb]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Adocao - Formulario de Responsabilidade</h1>
            <p className="mt-2 text-sm text-slate-600">
              Registro de adocao responsavel para animais resgatados pelo Projeto Social
              Coragem e Gentileza.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-[#0f766e] px-4 py-2 text-sm font-semibold text-[#0f766e]"
          >
            Voltar para home
          </Link>
        </div>

        <section className="mb-8 rounded-2xl bg-[#fff8e8] p-4 text-sm text-slate-700 ring-1 ring-[#f3e2be]">
          <p className="font-semibold text-[#7a5100]">Lembremos: maus-tratos e crime.</p>
          <p className="mt-2 leading-relaxed">
            Base legal: Lei Federal 9.605/98, art. 32 e Lei Municipal 7.367/18 (Criciuma).
            Nao fornecer agua e comida, abandonar, negar assistencia veterinaria e manter
            animal em condicoes inadequadas sao exemplos de maus-tratos.
          </p>
        </section>

        {isLoadingAnimals ? (
          <p className="mb-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Carregando animais disponiveis...
          </p>
        ) : null}

        {successProtocol ? (
          <p className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-emerald-200">
            Solicitacao enviada com sucesso. Protocolo: <strong>{successProtocol}</strong>
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {errorMessage}
          </p>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Animal para adocao *
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={selectedAnimalId}
                onChange={(event) => setSelectedAnimalId(event.target.value)}
                required
              >
                {animals.length === 0 ? <option value="">Sem animais disponiveis</option> : null}
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} - {animal.city}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              E-mail do adotante responsavel *
              <input
                type="email"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterEmail}
                onChange={(event) => updateFormField("adopterEmail", event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Nome do adotante responsavel *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterName}
                onChange={(event) => updateFormField("adopterName", event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              CPF do adotante responsavel *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterCpf}
                onChange={(event) => updateFormField("adopterCpf", event.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Telefones (minimo dois, com DDD) *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterPhones}
                onChange={(event) => updateFormField("adopterPhones", event.target.value)}
                placeholder="(48) 99999-9999 / (48) 98888-8888"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Profissao do adotante *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterProfession}
                onChange={(event) => updateFormField("adopterProfession", event.target.value)}
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
              Endereco residencial completo *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={formState.adopterAddress}
                onChange={(event) => updateFormField("adopterAddress", event.target.value)}
                placeholder="Rua, numero, bairro, cidade e CEP"
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
              Foto da identidade/CNH *
              <input
                type="file"
                accept=".pdf,image/*"
                className="rounded-lg border border-slate-300 px-3 py-2"
                onChange={(event) => setIdentityDocument(event.target.files?.[0] ?? null)}
                required
              />
            </label>
          </section>

          {selectedAnimal ? (
            <section className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Dados do animal adotado</h2>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                <p>
                  <strong>Nome:</strong> {selectedAnimal.name}
                </p>
                <p>
                  <strong>Especie:</strong> {selectedAnimal.species === "cao" ? "Cao" : "Gato"}
                </p>
                <p>
                  <strong>Idade:</strong> {selectedAnimal.ageLabel}
                </p>
                <p>
                  <strong>Vacinado:</strong> {selectedAnimal.vaccinated ? "Sim" : "Nao"}
                </p>
                <p>
                  <strong>Castrado:</strong> {selectedAnimal.neutered ? "Sim" : "Nao"}
                </p>
              </div>

              {requiresProbableNeuteringDate ? (
                <label className="mt-4 flex flex-col gap-1 text-sm font-medium">
                  Data provavel de castracao *
                  <input
                    type="date"
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    value={formState.probableNeuteringDate}
                    onChange={(event) =>
                      updateFormField("probableNeuteringDate", event.target.value)
                    }
                    required
                  />
                </label>
              ) : null}
            </section>
          ) : null}

          <fieldset className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <legend className="px-1 text-sm font-semibold text-slate-700">
              Voce entendeu as condicoes legais e de responsabilidade? *
            </legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedLegalTerms"
                  value="sim"
                  checked={acceptedLegalTerms === "sim"}
                  onChange={() => setAcceptedLegalTerms("sim")}
                  required
                />
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedLegalTerms"
                  value="nao"
                  checked={acceptedLegalTerms === "nao"}
                  onChange={() => setAcceptedLegalTerms("nao")}
                />
                Nao
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <legend className="px-1 text-sm font-semibold text-slate-700">
              Compromisso de castracao quando atingir idade minima? *
            </legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedNeuteringCommitment"
                  value="sim"
                  checked={acceptedNeuteringCommitment === "sim"}
                  onChange={() => setAcceptedNeuteringCommitment("sim")}
                  required
                />
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedNeuteringCommitment"
                  value="nao"
                  checked={acceptedNeuteringCommitment === "nao"}
                  onChange={() => setAcceptedNeuteringCommitment("nao")}
                />
                Nao
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <legend className="px-1 text-sm font-semibold text-slate-700">
              Compromisso de vacinacao quando atingir idade minima? *
            </legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedVaccinationCommitment"
                  value="sim"
                  checked={acceptedVaccinationCommitment === "sim"}
                  onChange={() => setAcceptedVaccinationCommitment("sim")}
                  required
                />
                Sim
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedVaccinationCommitment"
                  value="nao"
                  checked={acceptedVaccinationCommitment === "nao"}
                  onChange={() => setAcceptedVaccinationCommitment("nao")}
                />
                Nao
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <legend className="px-1 text-sm font-semibold text-slate-700">
              Voce entende que adocao e compromisso de longo prazo? *
            </legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedResponsibleAdoption"
                  value="sim"
                  checked={acceptedResponsibleAdoption === "sim"}
                  onChange={() => setAcceptedResponsibleAdoption("sim")}
                  required
                />
                De acordo
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acceptedResponsibleAdoption"
                  value="nao"
                  checked={acceptedResponsibleAdoption === "nao"}
                  onChange={() => setAcceptedResponsibleAdoption("nao")}
                />
                Nao
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingAnimals || !selectedAnimal}
            className="w-full rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5a53] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Enviando solicitacao..." : "Enviar formulario de adocao"}
          </button>
        </form>
      </div>
    </main>
  );
}
