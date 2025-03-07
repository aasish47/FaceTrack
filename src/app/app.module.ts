import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
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
import { UserDashboardComponent } from './testComponents/user-panel/user-dashboard/user-dashboard.component';
import { NgChartsModule } from 'ng2-charts'; //npm install chart.js@3.9.1 ng2-charts@4.0.0 --force
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    UserDashboardComponent,
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
    UserLogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgChartsModule,
    RouterModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
