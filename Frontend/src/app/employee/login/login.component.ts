import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    title = 'Login';
    model: any = {};
    test: Date = new Date();

    constructor(
        public router: Router,
        private authService: AuthService,
    ) { }

    ngOnInit() {
        if (localStorage.getItem('__Webmax_User') !== null) {
            this.router.navigate(['/dashboard'])
        }
    }

    login() {
        this.authService.login(this.model)
    }
}
