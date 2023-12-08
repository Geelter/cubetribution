import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {SupabaseAuthService} from "../../../services/supabase/supabase-auth.service";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, DividerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(SupabaseAuthService);

  signUpForm: FormGroup;

  isSubmitting: boolean = false;

  async onSubmit() {
    this.isSubmitting = true;

    const { email, password } = this.signUpForm.value;

    await this.authService.signUpWithEmail(email, password);

    this.isSubmitting = false;
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (control && control instanceof FormGroup) {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      return password &&
      confirmPassword &&
      password.value === confirmPassword.value
        ? null
        : { passwordMismatch: true };
    }

    return null;
  };

  constructor() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(22)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(22)
      ]]
      },
      { validators: this.passwordMatchValidator }
    );
  }
}
