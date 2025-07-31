import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MultiFormData } from '../utils/models/main.models';
import { FormControlRequiredAttributeDirective } from '../utils/directives/required.directive';

export const LANGUAGES: MultiFormData[] = [
  { label: 'Typescript', value: 'ts' },
  { label: 'Javascript', value: 'js' },
  { label: 'Python', value: 'py' },
  { label: 'C++', value: 'cpp' },
  { label: 'Asembler', value: 'asm' },
  { label: 'Perl', value: 'pl' },
];

@Component({
  selector: 'app-languages',
  imports: [ReactiveFormsModule,
    FormControlRequiredAttributeDirective],
  templateUrl: './languages.html',
  styleUrl: './languages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  languages = LANGUAGES;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.form.addControl('language', this.fb.array([]));
  }

  onChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const selected = this.form.get('language') as FormArray;

    if (checkbox.checked) {
      selected.push(this.fb.control(checkbox.value));
    } else {
      const index = selected.controls.findIndex(
        (c) => c.value === checkbox.value,
      );
      if (index !== -1) selected.removeAt(index);
    }
  }
}
