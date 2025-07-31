import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

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
  form!: FormGroup;
  formName = input.required<string>();
  currentInput!: AbstractControl | null;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.currentInput = this.form.get(this.formName());

    this.form.statusChanges.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }
}
