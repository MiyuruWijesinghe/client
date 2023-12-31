import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {FormControl} from '@angular/forms';
import {EmployeeDataPage} from '../../../../entities/employee-data-page';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EmployeeService} from '../../../../services/employee.service';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Employee} from '../../../../entities/employee';
import {DesignationService} from '../../../../services/designation.service';
import {Designation} from '../../../../entities/designation';
import {ApiManager} from '../../../../shared/api-manager';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent extends AbstractComponent implements OnInit {

  employeeDataPage: EmployeeDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  designations: Designation[] = [];

  nameField = new FormControl();
  nicField = new FormControl();
  mobileField = new FormControl();
  designationField = new FormControl();

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private designationService: DesignationService
  ) {
    super();
  }

  get thumbnailUrl(): string {
    return ApiManager.getURL('files/thumbnail/');
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) {
      return;
    }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex = this.pageIndex;
    pageRequest.pageSize = this.pageSize;

    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('nic', this.nicField.value);
    pageRequest.addSearchCriteria('mobile', this.mobileField.value);
    pageRequest.addSearchCriteria('designation', this.designationField.value);

    this.employeeService.getAll(pageRequest).then((page: EmployeeDataPage) => {
      this.employeeDataPage = page;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.designationService.getAll().then((data: Designation[]) => {
      this.designations = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_EMPLOYEE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['photo', 'code', 'callingname', 'designation', 'nic', 'mobile'];

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

  async delete(employee: Employee): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: employee.callingname}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.employeeService.delete(employee.id);
      this.loadData();
    });
  }
}
