import { Component, OnInit } from '@angular/core';
import {PurchaseDataPage} from '../../../../entities/purchase-data-page';
import {Branch} from '../../../../entities/branch';
import {FormControl} from '@angular/forms';
import {PurchaseService} from '../../../../services/purchase.service';
import {BranchService} from '../../../../services/branch.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Purchase} from '../../../../entities/purchase';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-purchase-table',
  templateUrl: './purchase-table.component.html',
  styleUrls: ['./purchase-table.component.scss']
})
export class PurchaseTableComponent extends AbstractComponent implements OnInit {



  purchaseDataPage: PurchaseDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  branches: Branch[] = [];
  porders: Porder[] = [];

  branchField = new FormControl();
  porderField = new FormControl();


  constructor(
    private purchaseService: PurchaseService,
    private branchService: BranchService,
    private porderService: PorderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('branch', this.branchField.value);

    this.purchaseService.getAll(pageRequest).then((page: PurchaseDataPage) => {
      this.purchaseDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

      }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PURCHASE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'porder'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(purchase: Purchase): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: purchase.id}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.purchaseService.delete(purchase.id);
      this.loadData();
    });
  }

}
