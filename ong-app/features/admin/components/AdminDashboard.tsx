"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  fetchAdoptionApplications,
  updateAdoptionStatusRequest,
  type AdoptionApplication,
  type AdoptionStatus,
} from "@/features/adocoes";
import {
  createAnimalRequest,
  fetchAnimals,
  updateAnimalStatusRequest,
  type Animal,
  type AnimalSize,
  type AnimalSpecies,
} from "@/features/animais";

type AnimalFormState = {
  name: string;
  species: AnimalSpecies;
  ageLabel: string;
  size: AnimalSize;
  city: string;
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  imageUrl: string;
  temperamentTags: string;
};

const initialAnimalFormState: AnimalFormState = {
  name: "",
  species: "cao",
  ageLabel: "",
  size: "medio",
  city: "",
  vaccinated: true,
  neutered: true,
  description: "",
  imageUrl: "",
  temperamentTags: "",
};

const animalStatusLabels = {
  disponivel: "Disponivel",
  processo_adocao: "Em processo de adocao",
  adotado: "Adotado",
} as const;

const adoptionStatusLabels: Record<AdoptionStatus, string> = {
  pendente: "Pendente",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
};

export default function AdminDashboard() {
  const [animalForm, setAnimalForm] = useState<AnimalFormState>(initialAnimalFormState);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAnimal, setIsSubmittingAnimal] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [animalsResponse, applicationsResponse] = await Promise.all([
        fetchAnimals({ includeNonAvailable: true }),
        fetchAdoptionApplications(),
      ]);

      setAnimals(animalsResponse);
      setApplications(applicationsResponse);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os dados do painel.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function updateAnimalFormField(field: keyof AnimalFormState, value: string | boolean) {
    setAnimalForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateAnimal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmittingAnimal(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createAnimalRequest({
        name: animalForm.name,
        species: animalForm.species,
        ageLabel: animalForm.ageLabel,
        size: animalForm.size,
        city: animalForm.city,
        vaccinated: animalForm.vaccinated,
        neutered: animalForm.neutered,
        description: animalForm.description,
        imageUrl: animalForm.imageUrl,
        temperamentTags: animalForm.temperamentTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setAnimalForm(initialAnimalFormState);
      setSuccessMessage("Animal cadastrado com sucesso.");
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nao foi possivel cadastrar o animal.",
      );
    } finally {
      setIsSubmittingAnimal(false);
    }
  }

  async function handleAnimalStatusChange(animalId: string, nextStatus: string) {
    setIsSavingStatus(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateAnimalStatusRequest(animalId, {
        status: nextStatus as Animal["status"],
      });
      setSuccessMessage("Status do animal atualizado.");
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar status do animal.",
      );
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleApplicationStatusChange(applicationId: string, nextStatus: string) {
    setIsSavingStatus(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateAdoptionStatusRequest(applicationId, {
        status: nextStatus as AdoptionStatus,
      });
      setSuccessMessage("Status da solicitacao atualizado.");
      await loadDashboardData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar status da solicitacao.",
      );
    } finally {
      setIsSavingStatus(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] px-6 py-10 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-6 ring-1 ring-[#eadfcb]">
          <div>
            <h1 className="text-3xl font-semibold">Painel Administrativo - Coragem e Gentileza</h1>
            <p className="mt-2 text-sm text-slate-600">
              Cadastro de animais e gestao das solicitacoes de adocao responsavel.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-[#0f766e] px-4 py-2 text-sm font-semibold text-[#0f766e]"
          >
            Voltar para site publico
          </Link>
        </header>

        {errorMessage ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-emerald-200">
            {successMessage}
          </p>
        ) : null}

        <section className="rounded-3xl bg-white p-6 ring-1 ring-[#eadfcb]">
          <h2 className="text-xl font-semibold">Cadastrar novo cachorro</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleCreateAnimal}>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Nome *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.name}
                onChange={(event) => updateAnimalFormField("name", event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Especie *
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.species}
                onChange={(event) =>
                  updateAnimalFormField("species", event.target.value as AnimalSpecies)
                }
                required
              >
                <option value="cao">Cao</option>
                <option value="gato">Gato</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Idade *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.ageLabel}
                onChange={(event) => updateAnimalFormField("ageLabel", event.target.value)}
                placeholder="Ex: 2 anos"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Porte *
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.size}
                onChange={(event) =>
                  updateAnimalFormField("size", event.target.value as AnimalSize)
                }
                required
              >
                <option value="pequeno">Pequeno</option>
                <option value="medio">Medio</option>
                <option value="grande">Grande</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Cidade *
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.city}
                onChange={(event) => updateAnimalFormField("city", event.target.value)}
                placeholder="Criciuma, SC"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              URL da foto *
              <input
                type="url"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.imageUrl}
                onChange={(event) => updateAnimalFormField("imageUrl", event.target.value)}
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
              Descricao *
              <textarea
                className="min-h-24 rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.description}
                onChange={(event) => updateAnimalFormField("description", event.target.value)}
                required
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium">
              Tags de temperamento (separadas por virgula)
              <input
                type="text"
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={animalForm.temperamentTags}
                onChange={(event) =>
                  updateAnimalFormField("temperamentTags", event.target.value)
                }
                placeholder="Docil, Brincalhao, Sociavel"
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={animalForm.vaccinated}
                onChange={(event) =>
                  updateAnimalFormField("vaccinated", event.target.checked)
                }
              />
              Vacinado
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={animalForm.neutered}
                onChange={(event) => updateAnimalFormField("neutered", event.target.checked)}
              />
              Castrado
            </label>

            <button
              type="submit"
              disabled={isSubmittingAnimal}
              className="md:col-span-2 rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5a53] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmittingAnimal ? "Cadastrando..." : "Cadastrar cachorro"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-[#eadfcb]">
          <h2 className="text-xl font-semibold">Animais cadastrados</h2>

          {isLoading ? <p className="mt-4 text-sm text-slate-600">Carregando animais...</p> : null}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Nome</th>
                  <th className="px-3 py-2 font-medium">Especie</th>
                  <th className="px-3 py-2 font-medium">Cidade</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal.id} className="border-t border-slate-200">
                    <td className="px-3 py-3 font-medium">{animal.name}</td>
                    <td className="px-3 py-3">{animal.species === "cao" ? "Cao" : "Gato"}</td>
                    <td className="px-3 py-3">{animal.city}</td>
                    <td className="px-3 py-3">
                      <select
                        className="rounded-lg border border-slate-300 px-2 py-1"
                        value={animal.status}
                        disabled={isSavingStatus}
                        onChange={(event) =>
                          void handleAnimalStatusChange(animal.id, event.target.value)
                        }
                      >
                        {Object.entries(animalStatusLabels).map(([statusKey, statusLabel]) => (
                          <option key={statusKey} value={statusKey}>
                            {statusLabel}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-[#eadfcb]">
          <h2 className="text-xl font-semibold">Solicitacoes de adocao</h2>

          {applications.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">Nenhuma solicitacao registrada ainda.</p>
          ) : null}

          <div className="mt-4 space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Protocolo:</strong> {application.id}
                    </p>
                    <p>
                      <strong>Adotante:</strong> {application.adopterName}
                    </p>
                    <p>
                      <strong>E-mail:</strong> {application.adopterEmail}
                    </p>
                    <p>
                      <strong>Animal:</strong> {application.adoptedAnimalName}
                    </p>
                    <p>
                      <strong>Documento:</strong>{" "}
                      <a
                        href={application.identityDocumentPath}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0f766e] underline"
                      >
                        Ver arquivo
                      </a>
                    </p>
                  </div>

                  <label className="flex flex-col gap-1 text-sm font-medium">
                    Status da solicitacao
                    <select
                      className="rounded-lg border border-slate-300 px-2 py-1"
                      value={application.status}
                      disabled={isSavingStatus}
                      onChange={(event) =>
                        void handleApplicationStatusChange(application.id, event.target.value)
                      }
                    >
                      {Object.entries(adoptionStatusLabels).map(([statusKey, statusLabel]) => (
                        <option key={statusKey} value={statusKey}>
                          {statusLabel}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
