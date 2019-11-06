import { Injectable } from '@angular/core';
import { baseApiUrl, employeeKey } from '../../config/global';
import axios from 'axios';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
      public router: Router,
      public toastr: ToastrService
  ) {}

    login(model: any) {
        axios.post(`${baseApiUrl}/signin`, model)
            .then(res => {
                localStorage.setItem(employeeKey, JSON.stringify(res.data));
                this.router.navigate(['dashboard'])
            })
            .catch(err => {
                err.response.data ? this.toastr.error(err.response.data) : this.toastr.error(err)
            })
    }

}
