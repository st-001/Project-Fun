import { Component, inject } from "@angular/core";
import { Group, GroupService } from "../_services/group/group.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditGroupDialogComponent } from "../edit-group-dialog/edit-group-dialog.component";
import { defaultMatDialogTop } from "../util";

@Component({
  selector: "app-group",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./group.component.html",
  styleUrl: "./group.component.scss",
})
export class GroupComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  groupService = inject(GroupService);
  group: Group | undefined;
  groupId: number | undefined;
  constructor() {
    this.groupId = Number(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {
    await this.getGroup();
  }

  refreshNotes() {
    throw new Error("Method not implemented.");
  }

  async getGroup() {
    try {
      this.group = await firstValueFrom(
        this.groupService.getGroupById(this.groupId!),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/groups"]);
      }
    }
  }

  async openEditGroupDialog() {
    const dialogRef = this.dialog.open(EditGroupDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        groupId: this.group!.id,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Group;
    if (result) {
      await this.getGroup();
    }
  }
}
