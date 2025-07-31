import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageComponent } from '../error-message/error-message';
import { FormControlRequiredAttributeDirective } from '../utils/directives/required.directive';
import { CustomValidators } from '../utils/validators/custom.validators';

@Component({
  selector: 'app-user',
  imports: [
    ReactiveFormsModule,
    ErrorMessageComponent,
    FormControlRequiredAttributeDirective
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  get controls(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.form.addControl(
      'passwordConfirm',
      this.fb.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          CustomValidators.isEqualWith(this.form.controls['password']),
        ],
      }),
    );
  }
}
