import { FormControl, FormGroup, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { CustomValidators } from './custom.validators';

describe('urlValidator', () => {
  it('should return null for empty value', () => {
    const control = new FormControl('');
    expect(CustomValidators.urlValidator(control)).toBeNull();
  });

  it('should return null for a valid URL', () => {
    const control = new FormControl('https://example.com');
    expect(CustomValidators.urlValidator(control)).toBeNull();
  });

  it('should return { invalidUrl: true } for an invalid URL', () => {
    const control = new FormControl('not-a-url');
    expect(CustomValidators.urlValidator(control)).toEqual({
      invalidUrl: true,
    });
  });
});

describe('CustomValidators.patternValidator', () => {
  it('should return custom error key when pattern does not match', () => {
    const validator = CustomValidators.patternValidator(
      /[A-Z]/,
      'needsUppercase',
    );
    const control = new FormControl('lowercase');
    const result = validator(control);
    expect(result).toEqual({ needsUppercase: true });
  });

  it('should return null when pattern matches', () => {
    const validator = CustomValidators.patternValidator(
      /[A-Z]/,
      'needsUppercase',
    );
    const control = new FormControl('Uppercase');
    expect(validator(control)).toBeNull();
  });
});

describe('CustomValidators.isEqualWith', () => {
  it('should return null when controls have equal values', () => {
    const controlA = new FormControl('same');
    const controlB = new FormControl('same');
    const validator = CustomValidators.isEqualWith(controlA, controlB);
    expect(validator()).toBeNull();
  });

  it('should return { isEqualWith: true } when controls differ', () => {
    const controlA = new FormControl('one');
    const controlB = new FormControl('two');
    const validator = CustomValidators.isEqualWith(controlA, controlB);
    expect(validator()).toEqual({ isEqualWith: true });
  });
});

describe('CustomValidators.passwordStrength', () => {
  it('should return errors for a weak password', () => {
    const validator = CustomValidators.passwordStrength({ minLength: 6 });
    const control = new FormControl('ab');
    const result = validator(control);
    expect(result).toBeTruthy();
    expect(result!['containsUppercase']).toBe(true);
    expect(result!['containsNumbers']).toBe(true);
    expect(result!['containsSpecialCharacters']).toBe(true);
  });

  it('should return null for a strong password', () => {
    const validator = CustomValidators.passwordStrength({ minLength: 6 });
    const control = new FormControl('Str0ng!pass');
    expect(validator(control)).toBeNull();
  });
});

describe('validateWhen', () => {
  it('should apply validator when condition is true', () => {
    const group = new FormGroup({
      primaryContact: new FormControl('phone'),
      phone: new FormControl(''),
    });

    const validator = CustomValidators.validateWhen(
      'primaryContact',
      (ctx) => ctx.value === 'phone',
      Validators.required,
    );

    const result = validator(group.get('phone')!);
    expect(result).toEqual({ required: true });
  });

  it('should return null when condition is false', () => {
    const group = new FormGroup({
      primaryContact: new FormControl('email'),
      phone: new FormControl(''),
    });

    const validator = CustomValidators.validateWhen(
      'primaryContact',
      (ctx) => ctx.value === 'phone',
      Validators.required,
    );

    const result = validator(group.get('phone')!);
    expect(result).toBeNull();
  });
});
