import { Injectable } from '@angular/core';
import { baseApiUrl } from '../../config/global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  getEmployees(page: any) {
    return this.http.get(`${baseApiUrl}/employees?&page=${page}`)
  }

}
