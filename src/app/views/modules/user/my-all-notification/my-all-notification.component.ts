import {Component, OnInit} from '@angular/core';
import {Notification, NotificationDataPage} from '../../../../entities/notification';
import {NotificationService} from '../../../../services/notification.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-my-all-notification',
  templateUrl: './my-all-notification.component.html',
  styleUrls: ['./my-all-notification.component.scss']
})
export class MyAllNotificationComponent extends AbstractComponent implements OnInit {

  notificationDataPage: NotificationDataPage;
  displayedColumns: string[] = ['message', 'send_at', 'delivered_at', 'seen_at', 'delete-col'];
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    this.notificationService.getAll(pageRequest).then(async (page: NotificationDataPage) => {
      this.notificationDataPage = page;
      for (const notification of page.content){
        if (!notification.dodelivered){ await this.notificationService.setDelivered(notification.id); }
        if (!notification.doread){ this.notificationService.setRead(notification.id); }
      }
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  updatePrivileges(): any {
  }

  async delete(notification: Notification): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: null}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.notificationService.delete(notification.id);
      this.loadData();
    });
  }
}
