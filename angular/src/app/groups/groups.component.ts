import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { Group, GroupService } from "../_services/group/group.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewGroupDialogComponent } from "../create-new-group-dialog/create-new-group-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-groups",
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
  templateUrl: "./groups.component.html",
  styleUrl: "./groups.component.scss",
})
export class GroupsComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  groupService = inject(GroupService);
  dataSource = new MatTableDataSource<Group>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
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

  exportGroups() {
    throw new Error("Method not implemented.");
  }

  onRowClick(group: Group) {
    this.router.navigate(["/groups", group.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getAllGroups() {
    this.dataSource.data = await firstValueFrom(this.groupService.getAll());
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllGroups();
  }

  async openCreateNewGroupDialog() {
    const dialogRef = this.dialog.open(CreateNewGroupDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Group;
    if (result) {
      await this.getAllGroups();
    }
  }
}
