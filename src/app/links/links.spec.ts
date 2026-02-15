import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { LinkForm } from '../utils/models/main.models';
import { CustomValidators } from '../utils/validators/custom.validators';
import { Links } from './links';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, Links],
  template: `
    <form [formGroup]="form">
      <app-links formArrayName="links"></app-links>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    links: new FormArray<FormGroup<LinkForm>>([]),
  });
}

describe('Links', () => {
  it('should create and render the add button', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toContain('Add Link');
  });

  it('should add a FormGroup with url and title controls when addLink is called', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    addButton.click();
    fixture.detectChanges();

    const linksArray = fixture.componentInstance.form.get('links') as FormArray;
    expect(linksArray.length).toBe(1);

    const linkGroup = linksArray.at(0) as FormGroup;
    expect(linkGroup.get('url')).toBeTruthy();
    expect(linkGroup.get('title')).toBeTruthy();
  });

  it('should have required and urlValidator on url control', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const addButton = fixture.nativeElement.querySelector('button');
    addButton.click();
    fixture.detectChanges();

    const linksArray = fixture.componentInstance.form.get('links') as FormArray;
    const urlControl = (linksArray.at(0) as FormGroup).get('url')!;

    expect(urlControl.hasValidator(Validators.required)).toBe(true);
    expect(urlControl.hasValidator(CustomValidators.urlValidator)).toBe(true);
  });

  it('should remove a link when removeLink is called', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    // Add two links
    const addButton = fixture.nativeElement.querySelector('button');
    addButton.click();
    addButton.click();
    fixture.detectChanges();

    const linksArray = fixture.componentInstance.form.get('links') as FormArray;
    expect(linksArray.length).toBe(2);

    // Click first Remove button
    const removeButton = fixture.nativeElement.querySelector('.btn-danger');
    removeButton.click();
    fixture.detectChanges();

    expect(linksArray.length).toBe(1);
  });
});
