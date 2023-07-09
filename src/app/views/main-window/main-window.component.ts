import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const customerLink = new LinkItem('Customer Management', '/customers', 'people');
    const employeeLink = new LinkItem('Employee Management', '/employees', 'supervised_user_circle');
    const userLink = new LinkItem('User Management', '/users', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '/roles', 'assignment_ind');
    const supplierLink = new LinkItem('Supplier Management', '/suppliers', 'perm_identity');
    const branchlink = new LinkItem('Branch Management', '/branches', 'store');
    const itemlink = new LinkItem('Item Management', '/items', 'extension');
    const porderlink = new LinkItem('Purchase Order Management', '/porders', 'work');
    const purchaselink = new LinkItem('Purchase Management', '/purchases', 'shopping_basket');
    const inventorylink = new LinkItem('Inventory Management', '/inventories', 'shop');
    const salelink = new LinkItem('Sales Management', '/sales', 'payment');
    const complainlink = new LinkItem('Complains Management', '/complains', 'erroroutline');
    const reportlink = new LinkItem('Reports', '/reports', 'analytics');

    this.linkItems.push(dashboardLink);
    this.linkItems.push(customerLink);
    this.linkItems.push(branchlink);
    this.linkItems.push(roleLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(userLink);
    this.linkItems.push(itemlink);
    this.linkItems.push(supplierLink);
    this.linkItems.push(porderlink);
    this.linkItems.push(purchaselink);
    this.linkItems.push(inventorylink);
    this.linkItems.push(salelink);
    this.linkItems.push(complainlink);
    this.linkItems.push(reportlink);

  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(false); // set true if dark needed
      this.isDark = false; // set true if dark needed
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
