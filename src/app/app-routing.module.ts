import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// import { HomeComponent } from './components/home/home.component';
// import { AdminLoginComponent } from './components/admin-login/admin-login.component';
// import { UserLoginComponent } from './components/user-login/user-login.component';
// import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
// import { AdminComponent } from './components/admin/admin.component';


import { LoginComponent } from './testComponents/login/login.component';
import { AdminPanelComponent } from './testComponents/admin-panel/admin-panel.component';
import { DashboardComponent } from './testComponents/admin-panel/dashboard/dashboard.component';
import { UserDetailsComponent } from './testComponents/admin-panel/user-details/user-details.component';
import { RegistrationFormComponent } from './testComponents/admin-panel/registration-form/registration-form.component';

import { LogsComponent } from './testComponents/admin-panel/logs/logs.component';
import { NotificationComponent } from './testComponents/admin-panel/notification/notification.component';
import { UserPanelComponent } from './testComponents/user-panel/user-panel.component';
import { UserDashboardComponent } from './testComponents/user-panel/user-dashboard/user-dashboard.component';
import { UserLogsComponent } from './testComponents/user-panel/user-logs/user-logs.component';
import { AddCameraComponent } from './testComponents/admin-panel/add-camera/add-camera.component';
// These are previous Routes.
// const routes: Routes = [
//   { path: '', component: HomeComponent},
//   { path: 'home', component: HomeComponent},
//   { path: 'admin-login', component: AdminLoginComponent},
//   { path: 'user-login', component: UserLoginComponent},
//   { path: 'user-dashboard', component: UserDashboardComponent},
//   { path: 'admin', component: AdminComponent}
// ];

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-panel', 
    component: AdminPanelComponent, 
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // Default to dashboard
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-details', component: UserDetailsComponent },
      { path: 'registration-form', component: RegistrationFormComponent },
      { path: 'attendance-log', component: LogsComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'add-camera', component: AddCameraComponent },
    ]
  },
  {
    path: 'user-panel', 
    component: UserPanelComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // Default to dashboard
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'user-log', component: UserLogsComponent },
      // { path: 'notification', component: NotificationComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
