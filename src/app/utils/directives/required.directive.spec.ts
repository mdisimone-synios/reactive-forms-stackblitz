import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlRequiredAttributeDirective } from './required.directive';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, FormControlRequiredAttributeDirective],
  template: `
    <input id="required-input" [formControl]="requiredControl" />
    <input id="optional-input" [formControl]="optionalControl" />
  `,
})
class TestHostComponent {
  requiredControl = new FormControl('', Validators.required);
  optionalControl = new FormControl('');
}

describe('FormControlRequiredAttributeDirective', () => {
  it('should set required to boolean true on inputs with Validators.required', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const requiredInput: HTMLInputElement =
      fixture.nativeElement.querySelector('#required-input');
    const optionalInput: HTMLInputElement =
      fixture.nativeElement.querySelector('#optional-input');

    expect(requiredInput.required).toBe(true);
    expect(optionalInput.required).toBe(false);
  });
});
