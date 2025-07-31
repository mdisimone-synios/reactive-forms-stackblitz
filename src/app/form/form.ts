import { ChangeDetectionStrategy, Component, importProvidersFrom, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressComponent } from '../address/address';
import { BackendService } from '../data-access/backend.service';
import { KeywordsComponent } from '../keywords/keywords';
import { LanguagesComponent } from '../languages/languages';
import { UserComponent } from '../user/user';
import { CombinedForm, UserForm } from '../utils/models/main.models';
import { CustomValidators } from '../utils/validators/custom.validators';

const DEFAULT_DATA = {
  user: {
    title: '',
    username: '',
    //...
  }
}

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    UserComponent,
    AddressComponent,
    KeywordsComponent,
    LanguagesComponent,
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  private readonly backendService = inject(BackendService);
  private readonly fb = inject(FormBuilder);

  data = input({});

  currentData = {...DEFAULT_DATA, ...this.data()}

  form = this.fb.group<CombinedForm>({
    user: this.fb.group<UserForm>({
      title: this.fb.control(null),
      username: this.fb.control(this.currentData.user.username, {
        validators: [Validators.required],
        asyncValidators: [this.backendService.usernameValidator()],
        updateOn: 'blur',
      }),
      firstName: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        CustomValidators.passwordStrength({ minLength: 6 }),
      ]),
    }),
    address: this.fb.group({
      address: [''],
      city: [''],
      zip: ['', [Validators.min(1000), Validators.max(99999)]],
      country: ['', [Validators.required]],
    }),
    keywords: this.fb.group({
      
    }),
  });

  submit() {
    console.log(this.form.value);
  }
}
