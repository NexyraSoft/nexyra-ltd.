import { apiRequest } from "./api";
import { Vacancy } from "./admin";

export const careersService = {
  getActiveVacancies: () => apiRequest<Vacancy[]>("/careers"),
};
