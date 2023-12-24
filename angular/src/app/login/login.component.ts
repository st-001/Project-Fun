import { Component, inject } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });

  async login() {
    const result = await this.authService.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    });
  }
}