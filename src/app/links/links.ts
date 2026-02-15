import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageComponent } from '../error-message/error-message';
import { LinkForm } from '../utils/models/main.models';
import { CustomValidators } from './../utils/validators/custom.validators';

@Component({
  selector: 'app-links',
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './links.html',
  styleUrl: './links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Links {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(NonNullableFormBuilder);

  form!: FormArray<FormGroup<LinkForm>>;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormArray;
  }

  addLink(): void {
    const linkGroup = this.fb.group<LinkForm>({
      url: this.fb.control('', {
        validators: [Validators.required, CustomValidators.urlValidator],
      }),
      title: this.fb.control('', {
        validators: [Validators.required],
      }),
    });
    this.form.push(linkGroup);
  }

  removeLink(index: number): void {
    this.form.removeAt(index);
  }
}
