import { Routes } from "@angular/router";
import { ClientsComponent } from "./clients/clients.component";
import { ProjectsComponent } from "./projects/projects.component";
import { UsersComponent } from "./users/users.component";
import { GroupsComponent } from "./groups/groups.component";

export const routes: Routes = [
  { path: "clients", component: ClientsComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "users", component: UsersComponent },
  { path: "groups", component: GroupsComponent },
];
