import { Component, OnInit } from '@angular/core';
import {NotificationsService} from '../_services/notifications.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    private notifications: any = {};
    private employee: any = {};

    constructor(private notificationsService: NotificationsService) { }

    ngOnInit() {
        this.notifications.data = [];
        this.employee = JSON.parse(localStorage.getItem('__Webmax_User'));
        this.getNotifications();
    }

    getNotifications() {
        this.notificationsService.getNotifications(1, this.employee.id)
            .subscribe(response => {
                this.notifications = response;
            }, error => {
                console.log(error);
            });
    }

}
