import axios from "axios";
import { constants } from "../constants/constants";
import { alert, logger } from "../services";
import { AuthObservable } from "../utilities/auth.observable";
import { storage } from "./storage.service";

const axiosService = () => {
  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(async (config) => {
    const token = await storage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (publicUrls.some((urlStr) => config?.url?.includes(urlStr))) {
      return config;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          storage.setItem("accessToken", null);
          logger.info("401");
        } else if (status === 400 && data?.accessToken) {
          AuthObservable.getInstance().updatePersona(data.accessToken);
        } else if (status >= 500 && status < 600) {
          alert.error("Server is down");
        }

        return Promise.reject(error.response);
      } else if (error.request) {
        logger.error("No response received", error.request);
      } else {
        logger.error("Request setup error", error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpService = axiosService();

const publicUrls = [constants.publicUrls.ACCOUNT_API];
