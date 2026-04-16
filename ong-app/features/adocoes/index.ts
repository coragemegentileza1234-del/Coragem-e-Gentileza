export type {
  AdoptionApplication,
  AdoptionStatus,
  CreateAdoptionApplicationInput,
  UpdateAdoptionStatusInput,
} from "./types";

export {
  fetchAdoptionApplications,
  submitAdoptionRequest,
  updateAdoptionStatusRequest,
} from "./client/adocoesClient";
