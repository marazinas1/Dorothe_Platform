// Which roles the admin UI may hand out.
//
// Rule of the platform: there is exactly one developer — the platform builder.
// The developer role can never be invited or assigned through the admin panel,
// by anybody, including a developer. Owners and editors are managed freely by
// developers and owners.
export const ASSIGNABLE_ROLES = ["owner", "editor"] as const;

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export function isAssignableRole(value: string): value is AssignableRole {
  return (ASSIGNABLE_ROLES as readonly string[]).includes(value);
}
