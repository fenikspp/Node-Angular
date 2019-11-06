import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// noinspection JSDeprecatedSymbols
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import {
    AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './employee/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmployeeComponent } from './employee/employee.component';
import {HttpClientModule} from '@angular/common/http';

// noinspection JSDeprecatedSymbols
@NgModule({
    imports: [
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        })
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        MainLayoutComponent,
        EmployeeComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
