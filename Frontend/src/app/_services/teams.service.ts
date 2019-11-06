import { Injectable } from '@angular/core';
import { baseApiUrl } from '../../config/global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: HttpClient) { }

  getTeams(page: any) {
    return this.http.get(`${baseApiUrl}/teams?&page=${page}`)
  }

  getEmployees(team: any) {
    return this.http.get(`${baseApiUrl}/teams/${team}?employees=all`)
  }

}
