import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { User, UserService } from "../_services/user/user.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewUserDialogComponent } from "../create-new-user-dialog/create-new-user-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  userService = inject(UserService);
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "emailAddress",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  exportUsers() {
    throw new Error("Method not implemented.");
  }

  onRowClick(user: User) {
    this.router.navigate(["/users", user.id]);
  }

  async getAllUsers() {
    this.dataSource.data = await firstValueFrom(this.userService.getAll());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllUsers();
  }

  async openCreateNewUserDialog() {
    const dialogRef = this.dialog.open(CreateNewUserDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as User;
    if (result) {
      await this.getAllUsers();
    }
  }
}
