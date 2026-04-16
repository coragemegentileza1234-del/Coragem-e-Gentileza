export type {
  Animal,
  AnimalSize,
  AnimalSpecies,
  AnimalStatus,
  CreateAnimalInput,
  UpdateAnimalStatusInput,
} from "./types";

export {
  createAnimalRequest,
  fetchAnimalById,
  fetchAnimals,
  updateAnimalStatusRequest,
} from "./client/animaisClient";
