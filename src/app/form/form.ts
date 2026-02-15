import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressComponent } from '../address/address';
import { BackendService } from '../data-access/backend.service';
import { KeywordsComponent } from '../keywords/keywords';
import { LanguagesComponent } from '../languages/languages';
import { Links } from '../links/links';
import { Profile } from '../profile/profile';
import { UserComponent } from '../user/user';
import {
  CombinedForm,
  LinkForm,
  ProfileForm,
  UserForm,
} from '../utils/models/main.models';
import { CustomValidators } from './../utils/validators/custom.validators';

const DEFAULT_DATA = {
  user: {
    title: '',
    username: '',
    //...
  },
};

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    UserComponent,
    AddressComponent,
    KeywordsComponent,
    LanguagesComponent,
    Profile,
    Links,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  private readonly backendService = inject(BackendService);
  private readonly fb = inject(NonNullableFormBuilder);

  data = input({});

  currentData = { ...DEFAULT_DATA, ...this.data() };

  form: FormGroup<CombinedForm> = this.fb.group<CombinedForm>({
    user: this.fb.group<UserForm>(
      {
        username: this.fb.control(this.currentData.user.username, {
          validators: [Validators.required],
          asyncValidators: [this.backendService.usernameValidator()],
          updateOn: 'blur',
        }),
        password: this.fb.control('', {
          validators: [
            Validators.required,
            CustomValidators.passwordStrength({ minLength: 6 }),
          ],
        }),
        passwordConfirm: this.fb.control('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [
          (group) => {
            const password = group.get('password');
            const passwordConfirm = group.get('passwordConfirm');
            if (password && passwordConfirm) {
              return CustomValidators.isEqualWith(password, passwordConfirm)();
            }
            return null;
          },
        ],
      },
    ),
    profile: this.fb.group<ProfileForm>({
      title: this.fb.control<string | null>(null),
      firstName: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      lastName: this.fb.control('', {
        validators: [Validators.required],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      phone: this.fb.control('', {
        validators: [
          CustomValidators.validateWhen(
            'primaryContact',
            (context) => context.value === 'phone',
            Validators.required,
          ),
        ],
      }),
      primaryContact: this.fb.control(''),
    }),
    links: this.fb.array<FormGroup<LinkForm>>([]),
    address: this.fb.group({
      address: this.fb.control(''),
      city: this.fb.control(''),
      zip: this.fb.control('', {
        validators: [Validators.min(1000), Validators.max(99999)],
      }),
      country: this.fb.control<string | null>(null, {
        validators: [Validators.required],
      }),
    }),
    keywords: this.fb.group({}),
    language: new FormArray<FormControl<string>>([]),
  });

  submit() {
    console.log(this.form.value);
  }
}
