import { httpService } from "../../../shared/lib/services";
import { APIError } from "../../../shared/lib/types/error.type";
import { adminEndpoints } from "./api.endpoint";

const handleResponse = (response: any) => response?.data;

const handleError = (error: APIError) => {
  throw error;
};

export const getAllUsersApi = () => {
  return httpService
    .get(adminEndpoints.getAllUsers)
    .then(handleResponse)
    .catch(handleError);
};
