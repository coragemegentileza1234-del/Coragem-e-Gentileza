"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { fetchAnimals, type Animal, type AnimalSpecies } from "@/features/animais";

const helpCards = [
  {
    title: "Quero adotar",
    desc: "Escolha um cachorro, leia as informacoes e envie o formulario em poucos minutos.",
  },
  {
    title: "Quero ajudar",
    desc: "Contribua com racao, medicamentos, transporte ou custos veterinarios.",
  },
  {
    title: "Quero ser voluntario",
    desc: "Participe de feiras, eventos de adocao e visitas de acompanhamento.", 
  },
  {
    title: "Quero divulgar",
    desc: "Ajude na divulgacao dos animais para aumentar as chances de adocao.",
  },
];

const stories = [
  {
    title: "Do resgate ao sofa",
    text: "A Bela chegou assustada. Em 40 dias, estava segura e hoje vive com uma familia que segue as orientacoes da ONG.",
  },
  {
    title: "Uma nova chance",
    text: "O Max esperou meses por adocao e foi adotado por uma familia preparada para os custos e rotina de cuidados.",
  },
];

const speciesLabels: Record<AnimalSpecies, string> = {
  cao: "Caes",
  gato: "Gatos",
};

export default function PrototipoOngAdocaoHome() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<AnimalSpecies | "todos">("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAnimals() {
      try {
        setIsLoading(true);
        const response = await fetchAnimals();
        if (isActive) {
          setAnimals(response);
          setError(null);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Nao foi possivel carregar os animais agora.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAnimals();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredAnimals = useMemo(() => {
    if (selectedSpecies === "todos") {
      return animals;
    }

    return animals.filter((animal) => animal.species === selectedSpecies);
  }, [animals, selectedSpecies]);

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-slate-800">
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-10 md:pb-14 md:pt-14">
        <div className="mb-5 flex items-center justify-end gap-3">
          <Link
            href="/adocao"
            className="rounded-xl border border-[#0f766e] px-4 py-2 text-sm font-semibold text-[#0f766e] transition hover:bg-[#e7f6f4]"
          >
            Formulario de adocao
          </Link>
          <Link
            href="/admin"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Painel admin
          </Link>
        </div>

        <div className="grid gap-8 rounded-3xl bg-[#fff9ef] p-8 shadow-sm ring-1 ring-[#eadfcb] md:grid-cols-[1.2fr_1fr] md:items-center md:p-10">
          <div className="space-y-5">
            <p className="inline-flex rounded-full bg-[#fbe6bf] px-3 py-1 text-sm font-semibold text-[#835500]">
              ONG Coragem e Gentileza
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Adocao responsavel para cachorros resgatados de rua.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-700 md:text-lg">
              Centralizamos cadastro de animais, formulario de responsabilidade e
              acompanhamento para que cada adocao seja segura para a familia e para o animal.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#pets-disponiveis"
                className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5a53]"
              >
                Ver animais disponiveis
              </a>
              <Link
                href="/adocao"
                className="rounded-xl border border-[#0f766e] px-4 py-2.5 text-sm font-semibold text-[#0f766e] transition hover:bg-[#e6f6f4]"
              >
                Preencher formulario
              </Link>
            </div>
          </div>

          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efe7da]">
            <h2 className="text-lg font-semibold">Impacto atual</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f9f5ec] p-4">
                <strong className="block text-2xl text-[#0f766e]">{animals.length}</strong>
                <span className="text-sm text-slate-600">Animais disponiveis</span>
              </div>
              <div className="rounded-xl bg-[#f9f5ec] p-4">
                <strong className="block text-2xl text-[#0f766e]">100%</strong>
                <span className="text-sm text-slate-600">Adocao com termo formal</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="como-ajudar" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Como voce pode ajudar</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {helpCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#ede4d7]"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pets-disponiveis" className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">Animais esperando por um lar</h2>
          <div className="flex items-center gap-2 rounded-xl bg-white p-1 ring-1 ring-[#ece2d4]">
            <button
              type="button"
              onClick={() => setSelectedSpecies("todos")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                selectedSpecies === "todos"
                  ? "bg-[#0f766e] text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todos
            </button>
            {(Object.keys(speciesLabels) as AnimalSpecies[]).map((species) => (
              <button
                key={species}
                type="button"
                onClick={() => setSelectedSpecies(species)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  selectedSpecies === species
                    ? "bg-[#0f766e] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {speciesLabels[species]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-[#ece2d4]">
            Carregando animais...
          </p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        ) : null}

        {!isLoading && !error && filteredAnimals.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-[#ece2d4]">
            Nenhum animal disponivel neste filtro no momento.
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
            <article
              key={animal.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#ece3d6]"
            >
              <Image
                src={animal.imageUrl}
                alt={`Foto de ${animal.name} disponivel para adocao`}
                className="h-52 w-full object-cover"
                width={900}
                height={520}
              />
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="text-xl font-semibold">{animal.name}</h3>
                  <p className="text-sm text-slate-600">
                    {animal.ageLabel} • Porte {animal.size} • {animal.city}
                  </p>
                </div>
                <p className="text-sm text-slate-700">{animal.description}</p>
                <ul className="flex flex-wrap gap-2">
                  {animal.temperamentTags.map((tag) => (
                    <li
                      key={`${animal.id}-${tag}`}
                      className="rounded-full bg-[#f2eee5] px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/adocao?animalId=${animal.id}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5a53]"
                >
                  Quero adotar {animal.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Historias que inspiram</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <blockquote
              key={story.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#ece2d4]"
            >
              <p className="text-lg font-semibold">{story.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{story.text}</p>
            </blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
