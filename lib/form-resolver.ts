import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * Minimal react-hook-form resolver for zod schemas, so the project
 * needs no extra packages beyond the exact stack: react-hook-form +
 * zod only.
 */
export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") as keyof FieldErrors<T>;
      if (!errors[path]) {
        errors[path] = {
          type: issue.code,
          message: issue.message,
        } as FieldErrors<T>[keyof FieldErrors<T>];
      }
    }
    return { values: {} as T, errors };
  };
}
