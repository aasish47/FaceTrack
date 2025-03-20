import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './Components/login/login.component';
import { AdminPanelComponent } from './Components/admin-panel/admin-panel.component';
import { DashboardComponent } from './Components/admin-panel/dashboard/dashboard.component';
import { UserDetailsComponent } from './Components/admin-panel/user-details/user-details.component';
import { RegistrationFormComponent } from './Components/admin-panel/registration-form/registration-form.component';

import { LogsComponent } from './Components/admin-panel/logs/logs.component';
import { NotificationComponent } from './Components/admin-panel/notification/notification.component';
import { UserPanelComponent } from './Components/user-panel/user-panel.component';
import { UserDashboardComponent } from './Components/user-panel/user-dashboard/user-dashboard.component';
import { UserLogsComponent } from './Components/user-panel/user-logs/user-logs.component';
import { AddCameraComponent } from './Components/admin-panel/add-camera/add-camera.component';
import { AttendanceComponent } from './Components/attendance/attendance.component';

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
  { path: 'attendance', component: AttendanceComponent },
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
      { path: 'notification', component: NotificationComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
