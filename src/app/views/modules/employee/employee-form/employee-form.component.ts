
import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Employee} from '../../../../entities/employee';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../../../services/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {GenderService} from '../../../../services/gender.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {DesignationService} from '../../../../services/designation.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {Designation} from '../../../../entities/designation';
import {Civilstatus} from '../../../../entities/civilstatus';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {DateHelper} from '../../../../shared/date-helper';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {PageRequest} from '../../../../shared/page-request';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent extends AbstractComponent implements OnInit {


  nametitles: Nametitle[] = [];
  designations: Designation[] = [];
  genders: Gender[] = [];
  branches: Branch[] = [];
  civilstatuses: Civilstatus[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    callingname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    fullname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    dobirth: new FormControl('', [
      Validators.required
    ]),
    nic: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    land: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    email: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(255),
      Validators.email,
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    dorecruite: new FormControl('', [
      Validators.required
    ]),
    gender: new FormControl('', [
      Validators.required
    ]),
    civilstatus: new FormControl('', [
      Validators.required
    ]),
    designation: new FormControl('', [
      Validators.required
    ]),
    nametitle: new FormControl('', [
      Validators.required
    ]),
    photo: new FormControl(),
    branch: new FormControl(),


  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get callingnameField(): FormControl
  {return this.form.controls.callingname as FormControl;
  }
  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }
  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }
  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }
  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }
  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }
  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }
  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }
  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get dorecruiteField(): FormControl{
    return this.form.controls.dorecruite as FormControl;
  }
  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }
  get civilstatusField(): FormControl{
    return this.form.controls.civilstatus as FormControl;
  }
  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }
  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }
  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }
  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private genderService: GenderService,
    private branchService: BranchService,
    private civilstatusService: CivilstatusService,
    private designationService: DesignationService,
    private nametitleService: NametitleService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    if (!this.privilege.add){ return; }

    this.genderService.getAll().then((data: Gender[]) => {
      this.genders = data;
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

    this.civilstatusService.getAll().then((data: Civilstatus[]) => {
      this.civilstatuses = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.designationService.getAll().then((data: Designation[]) => {
      this.designations = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.nametitleService.getAll().then((data: Nametitle[]) => {
      this.nametitles = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
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

  async submit(): Promise<void> {
    this.photoField.markAsTouched();
    this.photoField.updateValueAndValidity();
    if (this.form.invalid) { return; }

    const employee: Employee = new Employee();
    employee.callingname = this.callingnameField.value;
    employee.fullname = this.fullnameField.value;
    employee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    employee.nic = this.nicField.value;
    employee.address = this.addressField.value;
    employee.mobile = this.mobileField.value;
    employee.land = (this.landField.value === '') ? null : this.landField.value;
    employee.description = this.descriptionField.value;
    employee.dorecruite = DateHelper.getDateAsString(this.dorecruiteField.value);
    employee.gender = this.genderField.value;
    employee.civilstatus = this.civilstatusField.value;
    employee.designation = this.designationField.value;
    employee.nametitle = this.nametitleField.value;
    employee.branch = this.branchField.value;
    employee.email = (this.emailField.value === '') ? null : this.emailField.value;
    if (this.photoField.value !== null && this.photoField.value !== []){
      employee.photo = this.photoField.value ? this.photoField.value[0] : null;
    }



    try{
      const resourceLink: ResourceLink = await this.employeeService.add(employee);
      await this.router.navigateByUrl('/employees/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  async sendMessage(): Promise<void> {
    if (this.notificationForm.invalid) { return; }
    const notification: Notification = new Notification();
    notification.message = this.messageField.value;
    try{
      await this.notificationService.add(this.systemUserField.value, notification);
      console.log(notification);
      this.notificationForm.reset();
      this.snackBar.open('Message sent', null, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }
}
