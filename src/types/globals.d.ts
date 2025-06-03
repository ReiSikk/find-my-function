export {}

// Create a type for the roles
// This provides auto-completion and prevents TypeScript errors when working with roles
export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}