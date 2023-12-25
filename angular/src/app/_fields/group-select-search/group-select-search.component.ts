import { Component, inject, Input, ViewChild } from "@angular/core";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AsyncPipe } from "@angular/common";
import { FormControl } from "@angular/forms";
import { firstValueFrom, ReplaySubject, Subject, takeUntil } from "rxjs";
import { Group, GroupService } from "../../_services/group/group.service";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-group-select-search",
  standalone: true,
  imports: [
    MatSelectModule,
    NgxMatSelectSearchModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: "./group-select-search.component.html",
  styleUrl: "./group-select-search.component.scss",
})
export class GroupSelectSearchComponent {
  @Input()
  public form!: FormGroup;
  groupService = inject(GroupService);
  groups: Group[] = [];
  groupFilterCtrl: FormControl = new FormControl("");
  filteredGroups: ReplaySubject<Group[]> = new ReplaySubject<Group[]>(1);
  @ViewChild("groupSelect", { static: true })
  groupSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  async ngOnInit() {
    this.groups = await firstValueFrom(this.groupService.getAll());

    this.filteredGroups.next(this.groups.slice(10));

    this.groupFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterGroups();
      });
  }

  protected filterGroups() {
    if (!this.groups) {
      return;
    }

    let search = this.groupFilterCtrl.value;
    if (!search) {
      this.filteredGroups.next(this.groups.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredGroups.next(
      this.groups.filter((group) =>
        group.name.toLowerCase().indexOf(search) > -1
      ),
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
