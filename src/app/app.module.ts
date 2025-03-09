import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminPanelComponent } from './Components/admin-panel/admin-panel.component';
import { UserPanelComponent } from './Components/user-panel/user-panel.component';
import { LoginComponent } from './Components/login/login.component';
import { AttendanceComponent } from './Components/attendance/attendance.component';
import { DashboardComponent } from './Components/admin-panel/dashboard/dashboard.component';
import { LogsComponent } from './Components/admin-panel/logs/logs.component';
import { UserDetailsComponent } from './Components/admin-panel/user-details/user-details.component';
import { FilterComponent } from './Components/admin-panel/filter/filter.component';
import { RegistrationFormComponent } from './Components/admin-panel/registration-form/registration-form.component';
import { AddCameraComponent } from './Components/admin-panel/add-camera/add-camera.component';
import { CustomizableErrorComponent } from './Components/admin-panel/customizable-error/customizable-error.component';
import { NotificationComponent } from './Components/admin-panel/notification/notification.component';
import { UserLogsComponent } from './Components/user-panel/user-logs/user-logs.component';
import { UserDashboardComponent } from './Components/user-panel/user-dashboard/user-dashboard.component';
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
    UserDetailsComponent,
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
