import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate  {

    constructor(private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean  {
        if (localStorage.getItem('__Webmax_User')) {
            const user = JSON.parse(localStorage.getItem('__Webmax_User'));
            if (user.type === 'admin') {
                return true;
            } else  {
                this.router.navigate(['dashboard']);
              return false;
            }
        } else {
            this.router.navigate(['employee/login']);
            return false;
        }
    }

}
