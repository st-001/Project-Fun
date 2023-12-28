import { Component, inject } from "@angular/core";
import { User, UserService } from "../_services/user/user.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditUserDialogComponent } from "../edit-user-dialog/edit-user-dialog.component";
import { defaultMatDialogTop } from "../util";
import { ResetUserPasswordDialogComponent } from "../reset-user-password-dialog/reset-user-password-dialog.component";

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
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  userService = inject(UserService);
  user: User | undefined;
  userId: number;
  constructor() {
    this.userId = Number(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {
    await this.getUser();
  }

  refreshNotes() {
    throw new Error("Method not implemented.");
  }

  async getUser() {
    try {
      this.user = await firstValueFrom(
        this.userService.getUserById(this.userId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/users"]);
      }
    }
  }

  async openEditUserDialog() {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        userId: this.userId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as User;
    if (result) {
      await this.getUser();
    }
  }

  async openResetUserPasswordDialog() {
    const dialogRef = this.dialog.open(ResetUserPasswordDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        userId: this.userId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as User;
    if (result) {
      await this.getUser();
    }
  }
}
