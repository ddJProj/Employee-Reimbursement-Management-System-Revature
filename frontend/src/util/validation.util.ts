/**
 * @file src/util/validation.util.ts
 * @description reusable validation utilities using Zod schemas
 * @module Utilities
 * 
 * Resources:
 * - @see {https://zod.dev/} - zod documentation
 * - @see {https://www.patterns.dev/posts/form-validation/} - form validation patterns
 * - @see {https://regexr.com/} - regex for email/password
 * - @see {} - 
 */
import { zod } from "zod";
import { isValid, parseISO } from "date-fns";



// define the reusable patterns and schemas with proper typing
export const validationUtil = {
  /**
   * reusable validation / regex
   */
  patterns: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  },

  /**
   * common zod schema
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
   * validates data with zod schema
   * @param schema - zod schema to validate input
   * @param data - data to validate
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
