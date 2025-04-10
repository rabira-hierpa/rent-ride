import { AuthState, User } from "../models/";

export class AuthObservable {
  private static instance: AuthObservable;

  subscriptions: ((authInfo: AuthState) => void)[] = [];

  public static getInstance(): AuthObservable {
    if (!AuthObservable.instance) {
      AuthObservable.instance = new AuthObservable();
    }

    return AuthObservable.instance;
  }

  public updatePersona(data: {
    accessToken: { accessToken: string; expiresIn: number };
    user: User;
  }) {
    const authData: AuthState = {
      token: data?.accessToken.accessToken,
      user: data?.user,
      expiresAt: (Date.now() + data?.accessToken.expiresIn * 1000).toString(),
    };
    this.subscriptions.forEach((sub) => sub(authData));
  }

  public subscribe(callback: (authInfo: AuthState) => void) {
    this.subscriptions.push(callback);

    return () => {
      this.subscriptions = this.subscriptions.filter((cb) => cb !== callback);
    };
  }
}
