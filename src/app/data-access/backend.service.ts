import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';

const EXISTING_USERNAMES = ['hello', 'world', 'username', 'neutronenstern'];

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  existingUsernames = EXISTING_USERNAMES;
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
