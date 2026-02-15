import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorMessageComponent } from '../error-message/error-message';
import { FormControlRequiredAttributeDirective } from '../utils/directives/required.directive';
import { AddressForm, MultiFormData } from '../utils/models/main.models';

const COUNTRIES: MultiFormData[] = [
  { value: 'de-DE', label: 'Germany' },
  { value: 'de-AU', label: 'Austria' },
  { value: 'de-CH', label: 'Swiss' },
  { value: 'fr-FR', label: 'France' },
  { value: 'en-US', label: 'USA' },
  { value: 'en-AU', label: 'Australia' },
  { value: 'en-GB', label: 'Great Britain' },
];

@Component({
  selector: 'app-address',
  imports: [
    ReactiveFormsModule,
    ErrorMessageComponent,
    FormControlRequiredAttributeDirective
  ],
  templateUrl: './address.html',
  styleUrl: './address.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);
  form!: FormGroup<AddressForm>;

  countries = COUNTRIES;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
