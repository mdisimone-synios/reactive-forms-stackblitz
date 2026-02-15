import { describe, it, expect } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KeywordsComponent, KEYWORDS } from './keywords';

@Component({
  selector: 'app-test-host',
  imports: [ReactiveFormsModule, KeywordsComponent],
  template: `
    <form [formGroup]="form">
      <app-keywords formGroupName="keywords"></app-keywords>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    keywords: new FormGroup({}),
  });
}

describe('KeywordsComponent', () => {
  it('should dynamically add controls with boolean initial value false', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const keywordsGroup = fixture.componentInstance.form.get('keywords') as FormGroup;

    for (const keyword of KEYWORDS) {
      const control = keywordsGroup.get(keyword.value);
      expect(control).toBeTruthy();
      expect(control!.value).toBe(false);
    }
  });

  it('should render checkboxes for all keywords', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(KEYWORDS.length);
  });
});
