import { jwtDecode } from "jwt-decode";
import { createContext, useState, useCallback, useEffect } from "react";
import { useAuthAPI } from "../../features/account/apis/use-auth-api";
import { constants } from "../lib/constants/constants";
import { AuthState, User, USER_ROLES } from "../lib/models";
import { storage, logger, alert } from "../lib/services";
import { Environment } from "../lib/types/environment.type";
import { AuthObservable } from "../lib/utilities/auth.observable";
import { useNavigate } from "react-router-dom";
import { castUserToAuthUser } from "../lib/helpers/cast-user-to-auth-user";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const { Provider } = AuthContext;

interface AuthContextProps {
  authState?: AuthState;
  setAuthState?: (authInfo: AuthState) => void;
  logout?: (redirect?: boolean) => void;
  isAuthenticated?: () => boolean | undefined;
  isAdmin?: () => boolean | undefined;
  hasRoles?: (roles: string[]) => boolean | undefined;
  loading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
  environment: Environment;
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  environment,
}) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>();
  const { getCurrentUserApi } = useAuthAPI(environment);
  const [loading, setLoading] = useState(true);

  AuthObservable.getInstance().subscribe(async (authInfo) => {
    setAuthInfo(authInfo);
  });

  // Retrieves authState from browser storage and latest user details from API
  // and saves latest authState to context and browser storage
  async function retrieveAuthState() {
    try {
      setLoading(true);
      const expiresAt = localStorage.getItem(constants.EXPIRES_AT);

      const [token, latestUserDetails] = await Promise.all([
        storage.getItem<string>(constants.TOKEN),
        getCurrentUserApi(),
      ]);
      const latestAuthUserDetails = castUserToAuthUser(
        latestUserDetails,
        Number.parseInt(expiresAt!)
      );
      if (token) {
        const decodedUser = jwtDecode<User>(token);
        const decodedAuthUser = castUserToAuthUser(
          decodedUser,
          Number.parseInt(expiresAt!)
        );
        if (decodedAuthUser) {
          const authItems = {
            token,
            user: latestAuthUserDetails || decodedAuthUser,
            expiresAt: expiresAt!,
          };
          setAuthInfo(authItems);
        }
      }
    } catch (error) {
      logger.error("Error while trying to login: ", error);
      setAuthState({ token: "", expiresAt: "", user: {} });
    } finally {
      setLoading(false);
    }
  }

  // Saves authState to browser storage
  async function saveAuthState(_authState: AuthState) {
    localStorage.setItem(constants.TOKEN, JSON.stringify(_authState.token));
    localStorage.setItem(constants.USER, JSON.stringify(_authState?.user));
    localStorage.setItem(constants.EXPIRES_AT, _authState.expiresAt!);

    await storage.setItem(constants.TOKEN, _authState.token);
  }

  // Saves authState to context and to browser storage
  function setAuthInfo(authInfo: AuthState) {
    setLoading(true);
    const authItems = {
      token: authInfo.token,
      user: authInfo?.user,
      expiresAt: authInfo?.expiresAt,
    };
    setAuthState(authItems);
    saveAuthState(authItems);
    setLoading(false);
  }

  const logout = (redirect = true) => {
    setLoading(true);
    localStorage.removeItem(constants.TOKEN);
    localStorage.removeItem(constants.USER);
    localStorage.removeItem(constants.EXPIRES_AT);
    storage
      .removeItem(constants.TOKEN)
      .then(() => {
        setAuthInfo({ token: "", expiresAt: "", user: {} });
        if (redirect) {
          navigate("/account");
        }
        setLoading(false);
      })
      .catch(() => {
        alert.error("Encountered an error while logging out.");
        setLoading(false);
      });
  };

  const isAuthenticated = useCallback(() => {
    if (!authState?.token || !authState?.expiresAt) {
      return false;
    }
    return new Date().getTime() < parseInt(authState.expiresAt);
  }, [authState]);

  const isAdmin = useCallback(() => {
    return authState?.user?.roles?.includes(USER_ROLES.ADMIN);
  }, [authState]);

  // returns true if user holds even one role in the array
  const hasRoles = useCallback(
    (roles: string[]) => {
      return authState?.user?.roles?.some(
        (role) => roles?.indexOf(role) !== -1
      );
    },
    [authState]
  );

  useEffect(() => {
    retrieveAuthState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider
      value={{
        authState,
        setAuthState: setAuthInfo,
        logout,
        isAuthenticated,
        isAdmin,
        hasRoles,
        loading,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider, useAuthAPI };
