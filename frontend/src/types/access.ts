export interface AccessStore {
  access: string[];
  setAccess: (newAccess: string[], userId: string) => void;
  hasAccess: (permission: string) => boolean;
  userId: string | null;
}

export type JwtPayload = {
  exp: number;
};
