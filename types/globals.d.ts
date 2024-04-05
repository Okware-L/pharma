export {};

// Create a type for the roles
export type Roles = "admin" | "doctor";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
