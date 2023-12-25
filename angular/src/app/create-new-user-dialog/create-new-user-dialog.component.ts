import { Component, inject, ViewChild } from "@angular/core";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserService } from "../_services/user/user.service";
import { firstValueFrom, ReplaySubject, Subject, takeUntil } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Group, GroupService } from "../_services/group/group.service";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-create-new-user-dialog",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatCheckboxModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    AsyncPipe,
  ],
  templateUrl: "./create-new-user-dialog.component.html",
  styleUrl: "./create-new-user-dialog.component.scss",
})
export class CreateNewUserDialogComponent {
  userService = inject(UserService);
  groupService = inject(GroupService);
  groups: Group[] = [];
  groupFilterCtrl: FormControl = new FormControl("");
  filteredGroups: ReplaySubject<Group[]> = new ReplaySubject<Group[]>(1);
  @ViewChild("groupSelect", { static: true })
  groupSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();
  createNewUserForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
    emailAddress: new FormControl("", [Validators.required]),
    primaryGroupId: new FormControl(null, [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewUserDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.groups = await firstValueFrom(this.groupService.getAll());

    this.filteredGroups.next(this.groups.slice());

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
    // get the search keyword
    let search = this.groupFilterCtrl.value;
    if (!search) {
      this.filteredGroups.next(this.groups.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredGroups.next(
      this.groups.filter((group) =>
        group.name.toLowerCase().indexOf(search) > -1
      ),
    );
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.userService.createNewUser({
        name: this.createNewUserForm.value.name!,
        isEnabled: this.createNewUserForm.value.isEnabled!,
        emailAddress: this.createNewUserForm.value.emailAddress!,
        primaryGroupId: this.createNewUserForm.value.primaryGroupId!,
        password: this.createNewUserForm.value.password!,
      }));
      this.dialogRef.close(result);
    } catch (error) {
      this._snackBar.open("Error creating user", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
      this.dialogRef.close();
      return;
    }

    this._snackBar.open("User created", "Dismiss", {
      duration: 5000,
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
