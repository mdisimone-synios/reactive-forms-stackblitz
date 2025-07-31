import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import {
  FormControlDirective,
  FormControlName,
  NgControl,
  Validators,
} from '@angular/forms';

@Directive({
  selector: '[formControl], [formControlName]',
})
export class FormControlRequiredAttributeDirective implements OnInit {
  private readonly elementRef = inject( ElementRef);
  private readonly ngControl = inject(NgControl);

  ngOnInit(): void {
    if (
      (this.ngControl instanceof FormControlName ||
        this.ngControl instanceof FormControlDirective) &&
      this.ngControl.control.hasValidator(Validators.required)
    ) {
      this.elementRef.nativeElement.required = 'true';
    }
  }
}
