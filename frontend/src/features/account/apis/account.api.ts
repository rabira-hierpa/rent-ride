import { User } from "../../../shared/lib/models";
import { httpService } from "../../../shared/lib/services";
import { Credentials } from "../../../shared/lib/types/crednetialds.type";
import { APIError } from "../../../shared/lib/types/error.type";
import { accountEndpoint } from "./api.endpoint";

const handleResponse = (response: any) => response?.data;

const handleError = (error: APIError) => {
  throw error;
};

export const loginApi = ({ email, password }: Credentials) => {
  return httpService
    .post(accountEndpoint.login, { email, password })
    .then(handleResponse)
    .catch(handleError);
};

export const registerApi = async (user: User) => {
  return httpService
    .post(accountEndpoint.register, user)
    .then(handleResponse)
    .catch(handleError);
};
export const isEmailExistApi = (email: string) => {
  return httpService
    .post(`${accountEndpoint.isEmailExist}`, { email: email })
    .then((response) => {
      return response?.data;
    });
};
