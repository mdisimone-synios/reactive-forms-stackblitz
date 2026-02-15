import { TestBed } from '@angular/core/testing';
import { FormArray, FormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { FormComponent } from './form';

describe('FormComponent', () => {
  let component: FormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have all expected form groups', () => {
    const form = component.form;
    expect(form.get('user')).toBeInstanceOf(FormGroup);
    expect(form.get('profile')).toBeInstanceOf(FormGroup);
    expect(form.get('address')).toBeInstanceOf(FormGroup);
    expect(form.get('keywords')).toBeInstanceOf(FormGroup);
  });

  it('should have links as a FormArray', () => {
    expect(component.form.get('links')).toBeInstanceOf(FormArray);
  });

  it('should have language as a FormArray', () => {
    expect(component.form.get('language')).toBeInstanceOf(FormArray);
  });

  it('should have user controls with correct validators', () => {
    const user = component.form.get('user') as FormGroup;
    expect(user.get('username')).toBeTruthy();
    expect(user.get('password')).toBeTruthy();
    expect(user.get('passwordConfirm')).toBeTruthy();
  });

  it('should have profile controls', () => {
    const profile = component.form.get('profile') as FormGroup;
    expect(profile.get('firstName')).toBeTruthy();
    expect(profile.get('lastName')).toBeTruthy();
    expect(profile.get('email')).toBeTruthy();
    expect(profile.get('phone')).toBeTruthy();
    expect(profile.get('primaryContact')).toBeTruthy();
  });

  it('should have address controls', () => {
    const address = component.form.get('address') as FormGroup;
    expect(address.get('address')).toBeTruthy();
    expect(address.get('city')).toBeTruthy();
    expect(address.get('zip')).toBeTruthy();
    expect(address.get('country')).toBeTruthy();
  });
});
