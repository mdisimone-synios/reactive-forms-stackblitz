import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type MultiFormData = {
  label: string;
  value: string;
};

export type UserForm = {
  username: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
};

export type ProfileForm = {
  title: FormControl<string | null>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  primaryContact: FormControl<string>;
};

export type AddressForm = {
  address: FormControl<string>;
  city: FormControl<string>;
  zip: FormControl<string>;
  country: FormControl<string | null>;
};

export type KeywordsForm = { [key: string]: FormControl<boolean> };

export type CombinedForm = {
  user: FormGroup<UserForm>;
  profile: FormGroup<ProfileForm>;
  address: FormGroup<AddressForm>;
  keywords: FormGroup<KeywordsForm>;
  links: FormArray<FormGroup<LinkForm>>;
  language: FormArray<FormControl<string>>;
};

export type LinkForm = {
  url: FormControl<string>;
  title: FormControl<string>;
};
