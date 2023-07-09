import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent extends AbstractComponent implements OnInit {
  customer: Customer;
  selectedId: number;

  constructor(
    private customerService: CustomerService,
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
      data: {message: this.customer.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.customerService.delete(this.customer.id);
      await this.router.navigateByUrl('/customers');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.customer = await this.customerService.get(this.selectedId);
    console.log(this.customer.tocreation);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_CUSTOMER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }
}
