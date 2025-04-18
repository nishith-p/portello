export type KindeUser<T = Record<string, unknown>> =
  | ({
      id: string;
      given_name: string | null;
      family_name: string | null;
      email: string | null;
      picture: string | null;
    } & T)
  | null;

export type AuthOptions = {
  requireAuth?: boolean;
  requireAdmin?: boolean;
};
