import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService } from '../../_services/notifications.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    notifications: any;
    private employee: any;
    private time: Date;
    private showSidebar: boolean;

    constructor(
        location: Location,
        private element: ElementRef,
        private router: Router,
        private notificationsService: NotificationsService
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.getNotifications();
        this.clock();

        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe(() => {
        this.sidebarClose();
            const $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible === 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            const $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() {
              body.classList.remove('nav-open');
              // noinspection JSPotentiallyInvalidUsageOfClassThis
                this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
      let title = this.location.prepareExternalUrl(this.location.path());
      if (title.charAt(0) === '#') {
          title = title.slice( 1 );
      }

      for (let item = 0; item < this.listTitles.length; item++) {
          if (this.listTitles[item].path === title) {
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    getNotifications() {
        this.employee = localStorage.getItem('__Webmax_User');
        this.notificationsService.getNotifications(1, JSON.parse(this.employee).id)
            .subscribe(response => {
                this.notifications = response
            }, error => {
                console.log(error)
            });
    }

    async logout() {
        await localStorage.removeItem('__Webmax_User');
        this.router.navigate(['employee/login'])
    }

    clock() {
        interval(1000).subscribe(
            () => {
                this.time = new Date()
            }
        )
    }

    SidebarOn() {
        setTimeout(() => {
            const sidebar = document.getElementsByClassName('sidebar')[0];
            sidebar.removeAttribute('hidden');
        }, 150);

        const icon = document.getElementById('icon1');
        icon.removeAttribute('hidden');

        const hiddenIcon = document.getElementById('icon2');
        hiddenIcon.setAttribute('hidden', 'true');

        const mainContent = document.getElementsByClassName('main-panel')[0];
        mainContent.removeAttribute('style');

        this.showSidebar = true;
    }

    SidebarOff() {
        setTimeout(() => {
            const sidebar = document.getElementsByClassName('sidebar')[0];
            sidebar.setAttribute('hidden', 'hidden');
        }, 20);

        const icon = document.getElementById('icon2');
        icon.removeAttribute('hidden');

        const hiddenIcon = document.getElementById('icon1');
        hiddenIcon.setAttribute('hidden', 'true');

        const mainContent = document.getElementsByClassName('main-panel')[0];
        mainContent.setAttribute('style', 'width: 100%');

        this.showSidebar = false
    }

    hideSidebar() {
        if (this.showSidebar === false) {
            this.SidebarOn()
        } else {
            this.SidebarOff()
        }
    }
}
