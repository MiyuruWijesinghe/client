import {Component, OnInit} from '@angular/core';
import {SaleDataPage} from '../../../../entities/sale-data-page';
import {FormControl} from '@angular/forms';
import {SaleService} from '../../../../services/sale.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Sale} from '../../../../entities/sale';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {BranchDataPage} from '../../../../entities/branch-data-page';

@Component({
  selector: 'app-sale-table',
  templateUrl: './sale-table.component.html',
  styleUrls: ['./sale-table.component.scss']
})
export class SaleTableComponent extends AbstractComponent implements OnInit {

  saleDataPage: SaleDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  branches: Branch[] = [];

  branchField = new FormControl();

  constructor(
    private saleService: SaleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<void> {

    this.updatePrivileges();

    if (this.privilege.showAll) {
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex = this.pageIndex;
      pageRequest.pageSize = this.pageSize;

      pageRequest.addSearchCriteria('branch', this.branchField.value);
      try {
        this.saleDataPage = await this.saleService.getAll(pageRequest);
      } catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
      this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
        this.branches = data.content;
      }).catch(e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SALE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['code', 'date', 'amount'];

    if (this.privilege.showOne) {
      this.displayedColumns.push('more-col');
    }
    if (this.privilege.delete) {
      this.displayedColumns.push('delete-col');
    }
  }

  paginate(e): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(sale: Sale): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: sale.id}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.saleService.delete(sale.id);
      this.loadData();
    });
  }

}
