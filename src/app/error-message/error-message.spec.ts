import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageComponent } from './error-message';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  template: `
    <form [formGroup]="form">
      <input formControlName="name" />
      <app-error-message formName="name"></app-error-message>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });
}

describe('ErrorMessageComponent', () => {
  it('should create and subscribe to control changes', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('app-error-message');
    expect(errorEl).toBeTruthy();
  });

  it('should show required error when control is invalid', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    // Control starts empty with required validator -> invalid
    const errorEl = fixture.nativeElement.querySelector('app-error-message');
    expect(errorEl.textContent).toContain('is required');
  });

  it('should not show error when control is valid', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.form.get('name')!.setValue('test');
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('app-error-message');
    expect(errorEl.textContent.trim()).toBe('');
  });
});
