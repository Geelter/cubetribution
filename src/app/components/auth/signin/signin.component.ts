import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseAuthService} from "../../../services/supabase/supabase-auth.service";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, ButtonModule, DividerModule, InputTextModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(SupabaseAuthService);

  signInForm: FormGroup;

  isSubmitting: boolean = false;

  async onSubmit() {
    this.isSubmitting = true;

    const { email, password } = this.signInForm.value;

    await this.authService.signInWithEmail(email, password);

    this.isSubmitting = false;
  }

  constructor() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
}
