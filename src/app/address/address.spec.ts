import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './address';
import { AddressForm } from '../utils/models/main.models';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, AddressComponent],
  template: `
    <form [formGroup]="form">
      <app-address formGroupName="address"></app-address>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    address: new FormGroup<AddressForm>({
      address: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      zip: new FormControl('', { nonNullable: true }),
      country: new FormControl<string | null>(null),
    }),
  });
}

describe('AddressComponent', () => {
  it('should create and render address controls', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('[formcontrolname="address"]')).toBeTruthy();
    expect(el.querySelector('[formcontrolname="city"]')).toBeTruthy();
    expect(el.querySelector('[formcontrolname="zip"]')).toBeTruthy();
    expect(el.querySelector('[formcontrolname="country"]')).toBeTruthy();
  });

  it('should have error-message referencing "address" control, not "number"', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const errorMessages = fixture.nativeElement.querySelectorAll('app-error-message');
    const formNames = Array.from(errorMessages).map(
      (el: any) => el.getAttribute('formname'),
    );
    expect(formNames).toContain('address');
    expect(formNames).not.toContain('number');
  });
});
