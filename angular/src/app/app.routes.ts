import { Routes } from "@angular/router";
import { ClientsComponent } from "./clients/clients.component";
import { ProjectsComponent } from "./projects/projects.component";
import { UsersComponent } from "./users/users.component";
import { GroupsComponent } from "./groups/groups.component";
import { TasksComponent } from "./tasks/tasks.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "clients", component: ClientsComponent },
  { path: "projects", component: ProjectsComponent },
  { path: "users", component: UsersComponent },
  { path: "groups", component: GroupsComponent },
  { path: "tasks", component: TasksComponent },
  { path: "contacts", component: ContactsComponent },
];
