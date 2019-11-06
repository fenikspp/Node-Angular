import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './employee/login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    { path: '',   redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'employee',      component: EmployeeComponent,
        children: [
            { path: 'login', component: LoginComponent }
        ]
    },
    { path: '',              component: AdminLayoutComponent,  canActivate: [AuthGuard],
        children: [
            { path: '', loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'}
        ]
    },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full',  canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
