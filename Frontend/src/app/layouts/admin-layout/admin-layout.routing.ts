import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AuthGuard } from '../../auth/auth.guard';
import { AdminGuard } from '../../auth/admin.guard';
import { AdminComponent } from '../../admin/admin.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,     canActivate: [AuthGuard]  },
    { path: 'user-profile',   component: UserProfileComponent,   canActivate: [AuthGuard]  },
    { path: 'table-list',     component: TableListComponent,     canActivate: [AuthGuard]  },
    { path: 'typography',     component: TypographyComponent,    canActivate: [AuthGuard]  },
    { path: 'icons',          component: IconsComponent,         canActivate: [AuthGuard]  },
    { path: 'maps',           component: MapsComponent,          canActivate: [AuthGuard]  },
    { path: 'notifications',  component: NotificationsComponent, canActivate: [AuthGuard]  },
    { path: 'upgrade',        component: UpgradeComponent,       canActivate: [AuthGuard]  },
    { path: 'admin',          component: AdminComponent,         canActivate: [AdminGuard] }
];
