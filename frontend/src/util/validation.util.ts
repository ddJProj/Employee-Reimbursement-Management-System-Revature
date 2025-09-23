// src/util/validation.util.ts
import { zod } from "zod";
import { isValid, parseISO } from "date-fns";

// Define the reusable patterns and schemas with proper typing
export const validationUtil = {
  /**
   * Reusable validation / regex
   */
  patterns: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },

  /**
   * Common Zod schema
   */
  schemas: {
    email: zod.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
    password: zod
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Weak password. Must include uppercase, lowercase, and numbers."),
    date: zod.string().refine(
      (value) => isValid(parseISO(value)),
      "Invalid date format. Use YYYY-MM-DD."
    ),
  },

  /**
   * Validates data with Zod schema.
   * @param schema - Zod schema to validate input
   * @param data - Data to validate
   * @returns Result with isValid flag and errors
   */
  validateWithSchema<T>(
    schema: zod.ZodType<T>,
    data: unknown
  ): { isValid: boolean; errors: Record<string, string> } {
    try {
      schema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const errors = error.errors.reduce((acc, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        }, {} as Record<string, string>);
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { _error: "Unknown error occurred" } };
    }
  },
};
