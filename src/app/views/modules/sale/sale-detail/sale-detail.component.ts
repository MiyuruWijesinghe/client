import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Sale} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {Inventory} from '../../../../entities/inventory';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent extends AbstractComponent implements OnInit {
  sale: Sale;
  selectedId: number;

  inventory: Inventory[];

  constructor(
    private saleService: SaleService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.sale.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.saleService.delete(this.sale.id);
      await this.router.navigateByUrl('/sales');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.sale = await this.saleService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SALE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

}
