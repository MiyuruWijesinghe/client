import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SupplierService} from '../../../../services/supplier.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Supplier} from '../../../../entities/supplier';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';


@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss']
})
export class SupplierTableComponent extends AbstractComponent implements OnInit {

  supplieDataPage: SupplierDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  nameField = new FormControl();
  contactField = new FormControl();

  constructor(
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

  async loadData(): Promise<void> {

    this.updatePrivileges();

    if (this.privilege.showAll) {
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex = this.pageIndex;
      pageRequest.pageSize = this.pageSize;

      pageRequest.addSearchCriteria('name', this.nameField.value);
      pageRequest.addSearchCriteria('contact', this.contactField.value);

      try {
        this.supplieDataPage = await this.supplierService.getAll(pageRequest);
      } catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SUPPLIER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['name', 'contacts', 'email'];

    if (this.privilege.showOne) {
      this.displayedColumns.push('more-col');
    }
    if (this.privilege.update) {
      this.displayedColumns.push('update-col');
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

  async delete(supplier: Supplier): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: supplier.name}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.supplierService.delete(supplier.id);
      this.loadData();
    });
  }

}
