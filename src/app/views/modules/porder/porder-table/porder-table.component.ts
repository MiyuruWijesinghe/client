import { Component, OnInit } from '@angular/core';
import {PorderDataPage} from '../../../../entities/porder-data-page';
import {FormControl} from '@angular/forms';
import {PorderService} from '../../../../services/porder.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Porder} from '../../../../entities/porder';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {PorderstatusService} from '../../../../services/porderstatus.service';
import {BranchService} from '../../../../services/branch.service';
import {SupplierService} from '../../../../services/supplier.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Porderstatus} from '../../../../entities/porderstatus';
import {Branch} from '../../../../entities/branch';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';
import {Supplier} from '../../../../entities/supplier';

@Component({
  selector: 'app-porder-table',
  templateUrl: './porder-table.component.html',
  styleUrls: ['./porder-table.component.scss']
})
export class PorderTableComponent extends AbstractComponent implements  OnInit {


  porderDataPage: PorderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  branches: Branch[] = [];
  suppliers: Supplier[] = [];
  porderstatuses: Porderstatus[];

  branchField = new FormControl();
  supplierField = new FormControl();
  porderstatusField = new FormControl();

  constructor(
    private porderService: PorderService,
    private porderstatusService: PorderstatusService,
    private branchService: BranchService,
    private supplierService: SupplierService,
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

    pageRequest.addSearchCriteria('porderstatus', this.porderstatusField.value);
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('supplier', this.supplierField.value);

    this.porderService.getAll(pageRequest).then((page: PorderDataPage) => {
      this.porderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.supplierService.getAll(new PageRequest()).then((data: SupplierDataPage) => {
      this.suppliers = data.content;
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


    this.porderstatusService.getAll().then((data: Porderstatus[]) => {
      this.porderstatuses = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });


  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PORDER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['porderstatus', 'supplier', 'branch'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(porder: Porder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: porder.id}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.porderService.delete(porder.id);
      this.loadData();
    });
  }

}
