import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPocketbaseService } from '../../core/services/auth-pocketbase.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPageComponent {
  private readonly auth = inject(AuthPocketbaseService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  loading = false;
  errorMessage = '';

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.auth.login(this.form.controls.email.value, this.form.controls.password.value);
      await this.router.navigateByUrl('/dashboard');
    } catch (error) {
      this.errorMessage = this.auth.toFriendlyError(error);
    } finally {
      this.loading = false;
    }
  }
}
