import type { FieldsErrors } from "./domain/shared/validators/validators-fields-interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      // containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>
      ) => R;
    }
  }
}
