import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MultiFormData } from '../utils/models/main.models';

export const LANGUAGES: MultiFormData[] = [
  { label: 'Typescript', value: 'ts' },
  { label: 'Javascript', value: 'js' },
  { label: 'Python', value: 'py' },
  { label: 'C++', value: 'cpp' },
  { label: 'Assembler', value: 'asm' },
  { label: 'Perl', value: 'pl' },
];

@Component({
  selector: 'app-languages',
  imports: [ReactiveFormsModule],
  templateUrl: './languages.html',
  styleUrl: './languages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(FormBuilder);
  form!: FormArray;

  languages = LANGUAGES;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormArray;
  }

  onChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.form.push(this.fb.control(checkbox.value));
    } else {
      const index = this.form.controls.findIndex(
        (c) => c.value === checkbox.value,
      );
      if (index !== -1) this.form.removeAt(index);
    }
  }
}
