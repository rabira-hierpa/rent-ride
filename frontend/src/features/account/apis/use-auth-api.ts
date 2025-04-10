import { constants } from "../../../shared/lib/constants/constants";
import { User } from "../../../shared/lib/models";
import { httpService, storage } from "../../../shared/lib/services";
import { Environment } from "../../../shared/lib/types/environment.type";
import { authEndpoints } from "./auth.endpoints";

export function useAuthAPI(environment: Environment) {
  async function checkAuth(_protected: boolean) {
    if (_protected) {
      const token = await storage.getItem(constants.TOKEN);
      if (!token) {
        throw new Error("Unauthorized request");
      }
    }
  }
  return {
    getCurrentUserApi: async () => {
      await checkAuth(authEndpoints(environment).getCurrentUser?.protected);
      return httpService
        .get<User>(authEndpoints(environment).getCurrentUser?.endpoint)
        .then((response) => {
          return response?.data;
        });
    },
  };
}
