import { Component, inject } from "@angular/core";
import { User, UserService } from "../_services/user/user.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshUser() {
    throw new Error("Method not implemented.");
  }
  openEditUserDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  user: User | undefined;
  constructor() {}

  async ngOnInit() {
    const userId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.user = await firstValueFrom(
        this.userService.getUserById(userId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/users"]);
      }
    }
  }
}
