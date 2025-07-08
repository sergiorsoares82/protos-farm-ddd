import { validateSync } from "class-validator";
import type {
  FieldsErrors,
  IValidatorFields,
} from "./validators-fields-interface";
import type { Notification } from "./notification";

// export abstract class ClassValidatorFields<PropsValidated>
//   implements IValidatorFields<PropsValidated>
// {
//   errors: FieldsErrors | null = null;
//   validatedData: PropsValidated | null = null;
//   validate(data: any): boolean {
//     const errors = validateSync(data);
//     if (errors.length) {
//       this.errors = {};
//       for (const error of errors) {
//         const field = error.property;
//         this.errors[field] = Object.values(error.constraints!);
//       }
//     } else {
//       this.validatedData = data;
//     }
//     return !errors.length;
//   }
// }

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    // const errors = validateSync(data, {
    //   groups: fields,
    // });

    const errors = validateSync(data); // ← Remove groups

    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        // Se foi especificado um conjunto de campos, pule os outros
        if (fields && !fields.includes(field)) {
          continue;
        }
        Object.values(error.constraints!).forEach((message) => {
          notification.addError(message, field);
        });
      }
      return !errors.length;
    }
  }
}
