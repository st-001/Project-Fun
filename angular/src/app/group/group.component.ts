import { Component, inject } from "@angular/core";
import { Group, GroupService } from "../_services/group/group.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

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
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshGroup() {
    throw new Error("Method not implemented.");
  }
  openEditGroupDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  groupService = inject(GroupService);
  group: Group | undefined;
  constructor() {}

  async ngOnInit() {
    const groupId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.group = await firstValueFrom(
        this.groupService.getGroupById(groupId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/groups"]);
      }
    }
  }
}
