import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Profile } from './profile';
import { ProfileForm } from '../utils/models/main.models';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, Profile],
  template: `
    <form [formGroup]="form">
      <app-profile formGroupName="profile"></app-profile>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    profile: new FormGroup<ProfileForm>({
      title: new FormControl<string | null>(null),
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      phone: new FormControl('', { nonNullable: true }),
      primaryContact: new FormControl('', { nonNullable: true }),
    }),
  });
}

describe('Profile', () => {
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should have error-message under Title referencing "title", not "country"', () => {
    const titleGroup = fixture.nativeElement.querySelector('select[formcontrolname="title"]');
    const parent = titleGroup.closest('.form-group');
    const errorMessage = parent.querySelector('app-error-message');
    if (errorMessage) {
      expect(errorMessage.getAttribute('formname')).not.toBe('country');
    }
  });

  it('should have phone label with for="phone"', () => {
    const phoneInput = fixture.nativeElement.querySelector('#phone');
    expect(phoneInput).toBeTruthy();
    const phoneLabel = fixture.nativeElement.querySelector('label[for="phone"]');
    expect(phoneLabel).toBeTruthy();
  });

  it('should not have duplicate IDs in the rendered template', () => {
    const allElements = fixture.nativeElement.querySelectorAll('[id]');
    const ids = Array.from(allElements).map((el: any) => el.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have radio labels matching radio input IDs', () => {
    const radioInputs = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    );
    for (const radio of Array.from(radioInputs) as HTMLInputElement[]) {
      const label = fixture.nativeElement.querySelector(
        `label[for="${radio.id}"]`,
      );
      expect(label).toBeTruthy();
    }
  });
});
