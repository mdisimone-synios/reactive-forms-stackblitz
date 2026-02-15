# Angular Reactive Forms — Patterns & Rezepte

## Inhaltsverzeichnis

- [Formular-Architektur](#formular-architektur)
- [Child-Component-Formulare mit ControlContainer](#child-component-formulare-mit-controlcontainer)
- [Das Parent-Formular aus einer Child-Komponente erweitern](#das-parent-formular-aus-einer-child-komponente-erweitern)
- [Dynamische FormControls mit FormArray](#dynamische-formcontrols-mit-formarray)
- [Select-Platzhalter](#select-platzhalter)
- [Radio Buttons](#radio-buttons)
- [Custom Validators](#custom-validators)
- [Kombinierte Validators](#kombinierte-validators)
- [Komponierte Validators](#komponierte-validators)
- [Async Validators](#async-validators)
- [Bedingte Validators](#bedingte-validators)
- [Wiederverwendbare Fehlermeldungs-Komponente](#wiederverwendbare-fehlermeldungs-komponente)
- [Auto-Required-Attribut-Direktive](#auto-required-attribut-direktive)

---

## Formular-Architektur

Das Formular wird in einer einzigen Parent-Komponente mit `NonNullableFormBuilder` definiert und ist stark typisiert durch ein `CombinedForm`-Interface. Jeder Abschnitt wird per `formGroupName` / `formArrayName` an eine Child-Komponente delegiert.

```ts
// main.models.ts
export type CombinedForm = {
  user: FormGroup<UserForm>;
  profile: FormGroup<ProfileForm>;
  address: FormGroup<AddressForm>;
  keywords: FormGroup<KeywordsForm>;
  links: FormArray<FormGroup<LinkForm>>;
  language: FormArray<FormControl<string>>;
};
```

```html
<!-- form.html -->
<form [formGroup]="form" (submit)="submit()">
  <app-user formGroupName="user"></app-user>
  <app-profile formGroupName="profile"></app-profile>
  <app-address formGroupName="address"></app-address>
  <app-links formGroupName="links"></app-links>
  <app-keywords formGroupName="keywords"></app-keywords>
  <app-languages formArrayName="language"></app-languages>
</form>
```

Child-Komponenten verwenden **niemals** ein `<form>`-Tag in ihrem Template — stattdessen `<div [formGroup]="form">`, um ungueltige verschachtelte `<form>`-Elemente zu vermeiden.

---

## Child-Component-Formulare mit ControlContainer

Child-Komponenten erhalten ihren Teil des Parent-Formulars ueber `ControlContainer`-Injection. Kein `@Input()` noetig.

```ts
// user.ts
@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);
  form!: FormGroup<UserForm>;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
```

Das Parent bindet die Sub-Group mit `formGroupName="user"`, und `ControlContainer` loest sich zur entsprechenden `FormGroup<UserForm>` auf.

---

## Das Parent-Formular aus einer Child-Komponente erweitern

Wenn eine Child-Komponente Controls dynamisch erzeugen muss, die dem Parent vorab nicht bekannt sind, kann sie die bereitgestellte `FormGroup` in `ngOnInit` erweitern.

```ts
// keywords.ts — fuegt pro Keyword ein FormControl<boolean> in die leere FormGroup des Parents ein
export class KeywordsComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);
  form!: FormGroup<KeywordsForm>;

  keywords = KEYWORDS;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.keywords.map((keyword) => {
      this.form.addControl(
        keyword.value,
        new FormControl(false, { nonNullable: true }),
      );
    });
  }
}
```

Das Parent definiert nur eine leere Group — die Child-Komponente befuellt sie:

```ts
// form.ts (Parent)
form = this.fb.group<CombinedForm>({
  // ...
  keywords: this.fb.group({}), // Child befuellt dies in ngOnInit
});
```

Fuer `FormArray`-basierte Child-Komponenten wie `LanguagesComponent` gilt dasselbe Muster, aber mit Push/Remove-Semantik:

```ts
// languages.ts — verwaltet ein FormArray<FormControl<string>> ueber Checkbox-Events
export class LanguagesComponent {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(FormBuilder);
  form!: FormArray;

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
```

```html
<!-- languages.html — kein formGroup-Binding, arbeitet direkt auf dem FormArray -->
@for (lang of languages; track lang.value; let i = $index) {
  <input
    type="checkbox"
    id="language-{{ i }}"
    [value]="lang.value"
    (change)="onChange($event)"
  />
  <label for="language-{{ i }}">{{ lang.label }}</label>
}
```

---

## Dynamische FormControls mit FormArray

`LinksComponent` zeigt das Hinzufuegen und Entfernen typisierter `FormGroup`s innerhalb eines `FormArray`.

```ts
// links.ts
export class Links {
  private readonly controlContainer = inject(ControlContainer);
  private readonly fb = inject(NonNullableFormBuilder);

  form!: FormArray<FormGroup<LinkForm>>;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormArray;
  }

  addLink(): void {
    this.form.push(
      this.fb.group<LinkForm>({
        url: this.fb.control('', {
          validators: [Validators.required, urlValidator],
        }),
        title: this.fb.control('', {
          validators: [Validators.required],
        }),
      }),
    );
  }

  removeLink(index: number): void {
    this.form.removeAt(index);
  }
}
```

```html
<!-- links.html -->
@for (link of form.controls; track link; let i = $index) {
  <div [formGroup]="link">
    <input formControlName="url" />
    <input formControlName="title" />
    <button type="button" (click)="removeLink(i)">Remove</button>
  </div>
}
<button type="button" (click)="addLink()">Add Link</button>
```

---

## Select-Platzhalter

Eine deaktivierte `<option>` mit `[ngValue]="null"` dient als Standard-Platzhalter. Das Control wird mit `null` initialisiert und als `FormControl<string | null>` typisiert.

```ts
country: this.fb.control<string | null>(null, {
  validators: [Validators.required],
}),
```

```html
<select formControlName="country">
  <option disabled [ngValue]="null">Select your country</option>
  @for (country of countries; track country) {
    <option [ngValue]="country.value">{{ country.label }}</option>
  }
</select>
```

Der deaktivierte Platzhalter kann nach einer Auswahl nicht erneut gewaehlt werden. `Validators.required` lehnt `null` ab und erzwingt so eine Auswahl.

---

## Radio Buttons

Mehrere `<input type="radio">`-Elemente teilen sich denselben `formControlName`. Das `value`-Attribut bestimmt, welcher Wert in das Control geschrieben wird.

```ts
primaryContact: this.fb.control(''),
```

```html
<label>Primary contact:</label>
<div class="form-check">
  <input type="radio" formControlName="primaryContact" value="email" id="primary-contact-1" />
  <label for="primary-contact-1">Email</label>
</div>
<div class="form-check">
  <input type="radio" formControlName="primaryContact" value="phone" id="primary-contact-2" />
  <label for="primary-contact-2">Phone</label>
</div>
```

---

## Custom Validators

### URL Validator

Nutzt den nativen `URL`-Konstruktor zur Validierung.

```ts
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return { invalidUrl: true };
  }
}
```

### Pattern Validator mit eigenem Error-Key

Wrapt `Validators.pattern`, gibt aber einen domainspezifischen Error-Key zurueck statt des generischen `pattern`-Fehlers.

```ts
patternValidator(pattern: string | RegExp, errorName: string): ValidatorFn {
  const patternValidator = Validators.pattern(pattern);
  return (control: AbstractControl): ValidationErrors | null => {
    const validationResult = patternValidator(control);
    if (validationResult) {
      return { [errorName]: true };
    }
    return null;
  };
},
```

---

## Kombinierte Validators

`isEqualWith` vergleicht die Werte zweier `AbstractControl`s. Wird als Group-Level-Validator angewendet, damit Zugriff auf beide Controls besteht.

```ts
isEqualWith(control: AbstractControl, compareTo: AbstractControl) {
  return (): ValidationErrors | null => {
    if (control.value !== compareTo.value) {
      return { isEqualWith: true };
    }
    return null;
  };
},
```

Angewendet auf die `user`-Group:

```ts
user: this.fb.group<UserForm>(
  {
    password: this.fb.control('', { validators: [Validators.required] }),
    passwordConfirm: this.fb.control('', { validators: [Validators.required] }),
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
```

Der Group-Level-Fehler wird mit einem `formName`-losen `<app-error-message>` angezeigt, das auf die Group selbst abzielt:

```html
<!-- Control-Level-Fehler -->
<app-error-message formName="passwordConfirm"></app-error-message>
<!-- Group-Level-Fehler (isEqualWith) -->
<app-error-message></app-error-message>
```

---

## Komponierte Validators

`passwordStrength` kombiniert mehrere `patternValidator`s mit `Validators.compose`. Jeder Sub-Validator gibt seinen eigenen Error-Key zurueck und ermoeglicht so granulare Fehlermeldungen.

```ts
passwordStrength(config: { minLength: number }): ValidatorFn {
  return Validators.compose([
    Validators.minLength(config.minLength),
    CustomValidators.patternValidator(/[A-Z]/, 'containsUppercase'),
    CustomValidators.patternValidator(/[a-z]/, 'containsLowercase'),
    CustomValidators.patternValidator(/[0-9]/, 'containsNumbers'),
    CustomValidators.patternValidator(/(?=.*\W)/, 'containsSpecialCharacters'),
  ]) as ValidatorFn;
},
```

---

## Async Validators

`BackendService.usernameValidator()` gibt eine `AsyncValidatorFn` zurueck, die gegen existierende Benutzernamen prueft.

```ts
@Injectable({ providedIn: 'root' })
export class BackendService {
  checkIfUsernameExists(username: string): Observable<boolean> {
    return of(this.existingUsernames.includes(username)).pipe(delay(1000));
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfUsernameExists(control.value).pipe(
        map((res) => (res ? { usernameExists: true } : null)),
      );
    };
  }
}
```

Angewendet mit `updateOn: 'blur'`, um nicht bei jedem Tastendruck auszuloesen:

```ts
username: this.fb.control('', {
  validators: [Validators.required],
  asyncValidators: [this.backendService.usernameValidator()],
  updateOn: 'blur',
}),
```

---

## Bedingte Validators

`validateWhen` wendet einen Validator nur an, wenn ein Geschwister-Control eine Bedingung erfuellt. Es abonniert die `valueChanges` des Geschwister-Controls, um eine Re-Validierung auszuloesen. Ein `subscribed`-Flag verhindert doppelte Subscriptions.

```ts
export function validateWhen(
  conditionalFieldName: string,
  whenCondition: (context: AbstractControl<any>) => boolean,
  validator: ValidatorFn,
): ValidatorFn {
  let subscribed = false;
  return (formControl) => {
    if (!formControl.parent) return null;

    const conditionalField = formControl.parent.get(conditionalFieldName);

    if (conditionalField) {
      if (!subscribed) {
        subscribed = true;
        conditionalField.valueChanges.subscribe(() => {
          formControl.updateValueAndValidity();
        });
      }
      if (whenCondition(conditionalField)) {
        return validator(formControl);
      }
    }
    return null;
  };
}
```

Verwendung — `phone` ist nur dann `required`, wenn `primaryContact` den Wert `"phone"` hat:

```ts
phone: this.fb.control('', {
  validators: [
    validateWhen(
      'primaryContact',
      (context) => context.value === 'phone',
      Validators.required,
    ),
  ],
}),
```

---

## Wiederverwendbare Fehlermeldungs-Komponente

`ErrorMessageComponent` ermittelt das Ziel-Control ueber `ControlContainer` und ein optionales `formName`-Input-Signal. Sie abonniert `statusChanges` und `valueChanges`, um die Change Detection im `OnPush`-Baum auszuloesen, und nutzt `takeUntilDestroyed` fuer automatisches Cleanup.

```ts
@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'invalid-feedback' },
})
export class ErrorMessageComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  formName = input<string | null>(null);
  currentControl!: AbstractControl;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    const name = this.formName();
    this.currentControl = (name && this.form.get(name)) || this.form;

    merge(this.currentControl.statusChanges, this.currentControl.valueChanges)
      .pipe(
        startWith(null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }
}
```

Wird `formName` weggelassen, zielt die Komponente auf die uebergeordnete `FormGroup` selbst ab — nuetzlich fuer Group-Level-Validators wie `isEqualWith`:

```html
<!-- Control-Level-Fehler -->
<app-error-message formName="password"></app-error-message>

<!-- Group-Level-Fehler (zielt auf die uebergeordnete FormGroup) -->
<app-error-message></app-error-message>
```

---

## Auto-Required-Attribut-Direktive

Setzt automatisch das native `required`-Attribut auf jedes Element, das `Validators.required` zugewiesen hat. Kein manuelles `required`-Attribut im Template noetig.

```ts
@Directive({
  selector: '[formControl], [formControlName]',
})
export class FormControlRequiredAttributeDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly ngControl = inject(NgControl);

  ngOnInit(): void {
    if (
      (this.ngControl instanceof FormControlName ||
        this.ngControl instanceof FormControlDirective) &&
      this.ngControl.control.hasValidator(Validators.required)
    ) {
      this.elementRef.nativeElement.required = true;
    }
  }
}
```

Im `imports`-Array jeder Komponente importieren — die Direktive greift auf alle `[formControl]`- und `[formControlName]`-Elemente im jeweiligen Template.
