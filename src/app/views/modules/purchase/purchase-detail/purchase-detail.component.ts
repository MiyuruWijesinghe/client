import {Component, OnInit} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {PurchaseService} from '../../../../services/purchase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss']
})
export class PurchaseDetailComponent extends AbstractComponent implements OnInit {

  purchase: Purchase;
  selectedId: number;

  constructor(
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      try {
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.purchase.code}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.purchaseService.delete(this.purchase.id);
      await this.router.navigateByUrl('/purchases');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.purchase = await this.purchaseService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PURCHASE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

}
