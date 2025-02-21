import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { AdminNotificationComponent } from './components/admin/admin-notification/admin-notification.component';
import { AttendanceLogsComponent } from './components/admin/attendance-logs/attendance-logs.component';
import { AddUserComponent } from './components/admin/add-user/add-user.component';
import { AdminPanelComponent } from './testComponents/admin-panel/admin-panel.component';
import { UserPanelComponent } from './testComponents/user-panel/user-panel.component';
import { LoginComponent } from './testComponents/login/login.component';
import { AttendanceComponent } from './testComponents/attendance/attendance.component';
import { DashboardComponent } from './testComponents/admin-panel/dashboard/dashboard.component';
import { LogsComponent } from './testComponents/admin-panel/logs/logs.component';
import { FilterComponent } from './testComponents/admin-panel/filter/filter.component';
import { RegistrationFormComponent } from './testComponents/admin-panel/registration-form/registration-form.component';
import { AddCameraComponent } from './testComponents/admin-panel/add-camera/add-camera.component';
import { CustomizableErrorComponent } from './testComponents/admin-panel/customizable-error/customizable-error.component';
import { NotificationComponent } from './testComponents/admin-panel/notification/notification.component';
import { UserLogsComponent } from './testComponents/user-panel/user-logs/user-logs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserDashboardComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminDashboardComponent,
    UserDetailsComponent,
    AdminNotificationComponent,
    AttendanceLogsComponent,
    AddUserComponent,
    AdminPanelComponent,
    UserPanelComponent,
    LoginComponent,
    AttendanceComponent,
    DashboardComponent,
    LogsComponent,
    FilterComponent,
    RegistrationFormComponent,
    AddCameraComponent,
    CustomizableErrorComponent,
    NotificationComponent,
    UserLogsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
