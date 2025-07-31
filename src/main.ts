import { ApplicationConfig, Component, NgModule, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormComponent } from './app/form/form';
import { FormControlRequiredAttributeDirective } from './app/utils/directives/required.directive';

@Component({
  selector: 'app-root',
  imports: [FormComponent],
  template: `<div class="container">
    <div class="row">
      <div class="col"><app-form></app-form></div>
    </div>
  </div> `,
})
export class App {}

bootstrapApplication(App).catch((err) =>
  console.error(err),
);
