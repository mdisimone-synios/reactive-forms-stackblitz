import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserComponent } from './user';
import { UserForm } from '../utils/models/main.models';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, UserComponent],
  template: `
    <form [formGroup]="form">
      <app-user formGroupName="user"></app-user>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    user: new FormGroup<UserForm>({
      username: new FormControl('', { nonNullable: true }),
      password: new FormControl('', { nonNullable: true }),
      passwordConfirm: new FormControl('', { nonNullable: true }),
    }),
  });
}

describe('UserComponent', () => {
  it('should create and initialize with parent form group', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const userEl = fixture.nativeElement.querySelector('app-user');
    expect(userEl).toBeTruthy();
  });

  it('should render username, password, and passwordConfirm inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input');
    const inputNames = Array.from(inputs).map(
      (i: any) => i.getAttribute('formcontrolname'),
    );
    expect(inputNames).toContain('username');
    expect(inputNames).toContain('password');
    expect(inputNames).toContain('passwordConfirm');
  });
});
