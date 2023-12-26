import { Routes } from "@angular/router";
import { ClientsComponent } from "./clients/clients.component";
import { ProjectsComponent } from "./projects/projects.component";
import { UsersComponent } from "./users/users.component";
import { GroupsComponent } from "./groups/groups.component";
import { TasksComponent } from "./tasks/tasks.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { LayoutComponent } from "./layout/layout.component";
import { ProjectComponent } from "./project/project.component";
import { ClientComponent } from "./client/client.component";
import { ContactComponent } from "./contact/contact.component";

export const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "/clients", pathMatch: "full" },
      {
        path: "clients",
        component: ClientsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "contacts",
        component: ContactsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "projects",
        component: ProjectsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "projects/:id",
        component: ProjectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "clients/:id",
        component: ClientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "contacts/:id",
        component: ContactComponent,
        canActivate: [AuthGuard],
      },
      { path: "users", component: UsersComponent, canActivate: [AuthGuard] },
      { path: "groups", component: GroupsComponent, canActivate: [AuthGuard] },
      { path: "tasks", component: TasksComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "/clients" },
];
