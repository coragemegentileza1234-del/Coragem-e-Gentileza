import Image from "next/image";

type Pet = {
  name: string;
  age: string;
  size: string;
  city: string;
  tags: string[];
  image: string;
};

type Story = {
  title: string;
  text: string;
};

type HelpCard = {
  title: string;
  desc: string;
};

const pets: Pet[] = [
  {
    name: "Luna",
    age: "2 anos",
    size: "Porte médio",
    city: "Criciúma, SC",
    tags: ["Calma", "Vacinada", "Ama crianças"],
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Thor",
    age: "4 anos",
    size: "Porte grande",
    city: "Içara, SC",
    tags: ["Brincalhão", "Castrado", "Sociável"],
    image:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mel",
    age: "1 ano",
    size: "Porte pequeno",
    city: "Criciúma, SC",
    tags: ["Filhote", "Dócil", "Apartamento"],
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
  },
];

const stories: Story[] = [
  {
    title: "Do resgate ao sofá",
    text: "A Bela chegou assustada. Hoje dorme no sofá da nova família e já ganhou até brinquedo favorito.",
  },
  {
    title: "Uma nova chance",
    text: "O Max esperou meses por adoção. Depois de um encontro perfeito, encontrou um lar cheio de carinho.",
  },
];

const helpCards: HelpCard[] = [
  {
    title: "Quero adotar",
    desc: "Encontre um pet compatível com seu estilo de vida.",
  },
  {
    title: "Quero ajudar",
    desc: "Doe, apadrinhe ou contribua com ração e cuidados.",
  },
  {
    title: "Quero ser voluntário",
    desc: "Participe de ações, feiras e cuidados com os animais.",
  },
  {
    title: "Quero divulgar um pet",
    desc: "Cadastre um animal e aumente as chances de adoção.",
  },
];

export default function PrototipoOngAdocaoHome() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-slate-800">
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="grid gap-8 rounded-3xl bg-[#fff9ef] p-8 shadow-sm ring-1 ring-[#eadfcb] md:grid-cols-[1.2fr_1fr] md:items-center md:p-10">
          <div className="space-y-5">
            <p className="inline-flex rounded-full bg-[#fbe6bf] px-3 py-1 text-sm font-semibold text-[#835500]">
              ONG Coragem e Gentileza
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Ajude um animal a encontrar um lar com cuidado e responsabilidade.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-700 md:text-lg">
              Conectamos animais resgatados a famílias preparadas para oferecer
              amor, segurança e rotina saudável.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#pets-disponiveis"
                className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5a53]"
              >
                Ver pets disponíveis
              </a>
              <a
                href="#como-ajudar"
                className="rounded-xl border border-[#0f766e] px-4 py-2.5 text-sm font-semibold text-[#0f766e] transition hover:bg-[#e6f6f4]"
              >
                Formas de ajudar
              </a>
            </div>
          </div>

          <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#efe7da]">
            <h2 className="text-lg font-semibold">Impacto em números</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f9f5ec] p-4">
                <strong className="block text-2xl text-[#0f766e]">124</strong>
                <span className="text-sm text-slate-600">Adoções em 2026</span>
              </div>
              <div className="rounded-xl bg-[#f9f5ec] p-4">
                <strong className="block text-2xl text-[#0f766e]">38</strong>
                <span className="text-sm text-slate-600">Animais em cuidado</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="como-ajudar" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Como você pode ajudar</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {helpCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#ede4d7]"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {card.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="pets-disponiveis" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Pets esperando por uma família</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <article
              key={pet.name}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#ece3d6]"
            >
              <Image
                src={pet.image}
                alt={`Foto de ${pet.name} disponível para adoção`}
                className="h-52 w-full object-cover"
                width={900}
                height={520}
              />
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="text-xl font-semibold">{pet.name}</h3>
                  <p className="text-sm text-slate-600">
                    {pet.age} • {pet.size} • {pet.city}
                  </p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {pet.tags.map((tag) => (
                    <li
                      key={`${pet.name}-${tag}`}
                      className="rounded-full bg-[#f2eee5] px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#0f766e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5a53]"
                >
                  Quero conhecer {pet.name}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-semibold md:text-3xl">Histórias que inspiram</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <blockquote
              key={story.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#ece2d4]"
            >
              <p className="text-lg font-semibold">{story.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {story.text}
              </p>
            </blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
