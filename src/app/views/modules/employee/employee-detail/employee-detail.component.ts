import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent extends AbstractComponent implements OnInit {
  employee: Employee;
  selectedId: number;
  photo: string = null;

  constructor(
    private employeeService: EmployeeService,
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
      data: {message: this.employee.callingname}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.employeeService.delete(this.employee.id);
      await this.router.navigateByUrl('/employees');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.employee = await this.employeeService.get(this.selectedId);

    if (this.employee.photo == null) {
      this.photo = null;
    } else {
      const photoObject = await this.employeeService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_EMPLOYEE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

}
