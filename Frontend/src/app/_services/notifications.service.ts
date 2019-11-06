import { Injectable } from '@angular/core';
import { baseApiUrl } from '../../config/global';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    constructor(private http: HttpClient) { }

    getNotifications(page: any, employee: any) {
        return this.http.get(`${baseApiUrl}/notifications?employee=${employee}&page=${page}`)
    }

}
