import { z } from "zod";

/**
 * Shared password validation used client-side and server-side.
 * Requirements: ≥8 chars, at least one uppercase, one lowercase, one digit.
 */
export const passwordSchema = z
  .string()
  .min(8, "tooShort")
  .regex(/[A-Z]/, "noUppercase")
  .regex(/[a-z]/, "noLowercase")
  .regex(/[0-9]/, "noDigit");

export type PasswordValidationError =
  | "tooShort"
  | "noUppercase"
  | "noLowercase"
  | "noDigit";

export function validatePassword(password: string): PasswordValidationError | null {
  const result = passwordSchema.safeParse(password);
  if (result.success) return null;
  // Zod reports errors in order: the first failing check is the most useful hint.
  const issue = result.error.issues[0];
  return (issue?.message as PasswordValidationError) ?? "tooShort";
}
