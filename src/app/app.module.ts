import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    UserLoginComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
