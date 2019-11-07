import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    att: boolean;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',      icon: 'dashboard',             class: '', att: false },
    { path: '/user-profile',  title: 'User Profile',   icon: 'person',                class: '', att: false },
    { path: '/table-list',    title: 'Table List',     icon: 'content_paste',         class: '', att: false },
    { path: '/typography',    title: 'Typography',     icon: 'library_books',         class: '', att: false },
    { path: '/icons',         title: 'Icons',          icon: 'bubble_chart',          class: '', att: false },
    { path: '/maps',          title: 'Maps',           icon: 'location_on',           class: '', att: false },
    { path: '/notifications', title: 'Notifications',  icon: 'notifications',         class: '', att: false },
    { path: '/admin',         title: 'Administração',  icon: 'settings_applications', class: '', att: true }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    title = 'Webmax';

    menuItems: any[];

    constructor(private router: Router) { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        return $(window).width() <= 991;
    };

    async logout() {
        await localStorage.removeItem('__Webmax_User');
        this.router.navigate(['employee/login'])
    }
}
