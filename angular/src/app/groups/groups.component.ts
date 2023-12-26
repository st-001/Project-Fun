import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class GroupsComponent implements OnInit {
  router = inject(Router);
  onRowClick(group: Group) {
    this.router.navigate(["/groups", group.id]);
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  async refreshGroups() {
    const groups = await this.getAllGroups();
    this.dataSource.data = groups;
  }
  exportGroups() {
    throw new Error("Method not implemented.");
  }

  private groupService = inject(GroupService);
  dataSource = new MatTableDataSource<Group>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor(public dialog: MatDialog) {}

  async getAllGroups() {
    const groups = await firstValueFrom(this.groupService.getAll());
    return groups;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const groups = await this.getAllGroups();
    this.dataSource.data = groups;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
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
      await this.refreshGroups();
    }
  }
}
