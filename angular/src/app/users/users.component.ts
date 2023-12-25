import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  async refreshUsers() {
    const users = await this.getAllUsers();
    this.dataSource.data = users;
  }
  exportUsers() {
    throw new Error("Method not implemented.");
  }

  private userService = inject(UserService);
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "emailAddress",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor(public dialog: MatDialog) {}

  async getAllUsers() {
    const users = await firstValueFrom(this.userService.getAll());
    return users;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const users = await this.getAllUsers();
    this.dataSource.data = users;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
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
      await this.refreshUsers();
    }
  }
}
