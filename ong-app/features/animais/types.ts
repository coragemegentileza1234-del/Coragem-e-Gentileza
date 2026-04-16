export type AnimalSpecies = "cao" | "gato";

export type AnimalSize = "pequeno" | "medio" | "grande";

export type AnimalStatus = "disponivel" | "processo_adocao" | "adotado";

export type Animal = {
  id: string;
  name: string;
  species: AnimalSpecies;
  ageLabel: string;
  size: AnimalSize;
  city: string;
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  imageUrl: string;
  temperamentTags: string[];
  status: AnimalStatus;
  createdAt: string;
};

export type CreateAnimalInput = {
  name: string;
  species: AnimalSpecies;
  ageLabel: string;
  size: AnimalSize;
  city: string;
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  imageUrl: string;
  temperamentTags: string[];
};

export type UpdateAnimalStatusInput = {
  status: AnimalStatus;
};
