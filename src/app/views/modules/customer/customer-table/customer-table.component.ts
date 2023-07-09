import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomerDataPage} from '../../../../entities/customer-data-page';
import {CustomerService} from '../../../../services/customer.service';
import {FormControl} from '@angular/forms';
import {PageRequest} from '../../../../shared/page-request';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Customer} from '../../../../entities/customer';
import {MatDialog} from '@angular/material/dialog';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent extends AbstractComponent implements OnInit{
  customerDataPage: CustomerDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  nameField = new FormControl();
  nicField = new FormControl();
  contactField = new FormControl();

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<void>{

    this.updatePrivileges();

    if (this.privilege.showAll){
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex  = this.pageIndex;
      pageRequest.pageSize  = this.pageSize;


      pageRequest.addSearchCriteria('name', this.nameField.value);
      pageRequest.addSearchCriteria('nic', this.nicField.value);
      pageRequest.addSearchCriteria('contact', this.contactField.value);

      try{
        this.customerDataPage = await this.customerService.getAll(pageRequest);
      }catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_CUSTOMER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'name', 'nic', 'contacts'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(customer: Customer): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: customer.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.customerService.delete(customer.id);
      this.loadData();
    });
  }

}
