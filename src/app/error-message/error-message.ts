import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { distinctUntilChanged, merge, startWith } from 'rxjs';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'invalid-feedback',
  },
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

    merge(
      this.currentControl.statusChanges,
      this.currentControl.valueChanges,
    )
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
