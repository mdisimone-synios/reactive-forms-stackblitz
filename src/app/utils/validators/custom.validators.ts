import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export const CustomValidators = {
  isEqualWith(control: AbstractControl, compareTo: AbstractControl) {
    return (): ValidationErrors | null => {
      if (control.value !== compareTo.value) {
        return { isEqualWith: true };
      }
      return null;
    };
  },
  patternValidator(pattern: string | RegExp, errorName: string): ValidatorFn {
    const patternValidator = Validators.pattern(pattern);

    return (control: AbstractControl): ValidationErrors | null => {
      const validationResult = patternValidator(control);

      if (validationResult) {
        return { [errorName]: true };
      }
      return null;
    };
  },
  passwordStrength(config: { minLength: number }): ValidatorFn {
    return Validators.compose([
      Validators.minLength(config.minLength),
      CustomValidators.patternValidator(/[A-Z]/, 'containsUppercase'),
      CustomValidators.patternValidator(/[a-z]/, 'containsLowercase'),
      CustomValidators.patternValidator(/[0-9]/, 'containsNumbers'),
      CustomValidators.patternValidator(
        /(?=.*\W)/,
        'containsSpecialCharacters',
      ),
    ]) as ValidatorFn;
  },
  urlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    try {
      new URL(value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  },
  validateWhen(
    conditionalFieldName: string,
    whenCondition: (context: AbstractControl<any>) => boolean,
    validator: ValidatorFn,
  ): ValidatorFn {
    let subscribed = false;
    return (formControl) => {
      if (!formControl.parent) {
        return null;
      }
      const conditionalField = formControl.parent.get(conditionalFieldName);

      if (conditionalField) {
        if (!subscribed) {
          subscribed = true;
          conditionalField.valueChanges.subscribe(() => {
            formControl.updateValueAndValidity();
          });
        }
        if (whenCondition(conditionalField)) {
          return validator(formControl);
        }
      }

      return null;
    };
  },
};
