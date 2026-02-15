import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { LanguagesComponent, LANGUAGES } from './languages';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, LanguagesComponent],
  template: `
    <form [formGroup]="form">
      <app-languages formArrayName="language"></app-languages>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    language: new FormArray<FormControl<string>>([]),
  });
}

describe('LanguagesComponent', () => {
  it('should have "Assembler" spelled correctly', () => {
    const assembler = LANGUAGES.find((l) => l.value === 'asm');
    expect(assembler).toBeTruthy();
    expect(assembler!.label).toBe('Assembler');
  });

  it('should render checkboxes for all languages', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    );
    expect(checkboxes.length).toBe(LANGUAGES.length);
  });

  it('should add to FormArray when checkbox is checked', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const checkbox: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const langArray = fixture.componentInstance.form.get('language') as FormArray;
    expect(langArray.length).toBe(1);
  });

  it('should remove from FormArray when checkbox is unchecked', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const checkbox: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="checkbox"]');

    // Check
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const langArray = fixture.componentInstance.form.get('language') as FormArray;
    expect(langArray.length).toBe(1);

    // Uncheck
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(langArray.length).toBe(0);
  });
});
