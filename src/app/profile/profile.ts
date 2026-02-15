import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorMessageComponent } from '../error-message/error-message';
import { FormControlRequiredAttributeDirective } from '../utils/directives/required.directive';
import { ProfileForm } from '../utils/models/main.models';

const TITLES = [
  { value: 'prof', label: 'Professor' },
  { value: 'sir', label: 'Sir' },
  { value: 'dr', label: 'Doctor' },
];

@Component({
  selector: 'app-profile',
  imports: [
    ErrorMessageComponent,
    ReactiveFormsModule,
    FormControlRequiredAttributeDirective,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  titles = TITLES;

  form!: FormGroup<ProfileForm>;
  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
