import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Nametitle} from '../../../../entities/nametitle';
import {Designation} from '../../../../entities/designation';
import {Gender} from '../../../../entities/gender';
import {Civilstatus} from '../../../../entities/civilstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Employeestatus} from '../../../../entities/employeestatus';
import {Employee} from '../../../../entities/employee';
import {ResourceLink} from '../../../../entities/resource-link';
import {GenderService} from '../../../../services/gender.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {DesignationService} from '../../../../services/designation.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {EmployeestatusService} from '../../../../services/employeestatus.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {PageRequest} from '../../../../shared/page-request';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-employee-update-form',
  templateUrl: './employee-update-form.component.html',
  styleUrls: ['./employee-update-form.component.scss']
})
export class EmployeeUpdateFormComponent extends AbstractComponent implements OnInit {
  selectedId: number;
  employee: Employee;

  nametitles: Nametitle[] = [];
  designations: Designation[] = [];
  genders: Gender[] = [];
  branches: Branch[] = [];
  civilstatuses: Civilstatus[] = [];
  employeestatuses: Employeestatus[] = [];
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
    employeestatus: new FormControl('', [
      Validators.required
    ]),
    photo: new FormControl(),
    branch: new FormControl()

  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
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

  get employeestatusField(): FormControl{
    return this.form.controls.employeestatus as FormControl;
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
    private employeestatusService: EmployeestatusService,
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }

    if (this.genderField.pristine) {
      this.genderService.getAll().then((data: Gender[]) => {
        this.genders = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    if (this.branchField.pristine) {
      this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
        this.branches = data.content;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    if (this.civilstatusField.pristine) {
      this.civilstatusService.getAll().then((data: Civilstatus[]) => {
        this.civilstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    if (this.genderField.pristine) {
      this.designationService.getAll().then((data: Designation[]) => {
        this.designations = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    if (this.nametitleField.pristine) {
      this.nametitleService.getAll().then((data: Nametitle[]) => {
        this.nametitles = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    if (this.employeestatusField.pristine) {
      this.employeestatusService.getAll().then((data: Employeestatus[]) => {
        this.employeestatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    this.employee = await this.employeeService.get(this.selectedId);
    this.setValues();

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

  discardChanges(): void{
    this.form.patchValue(this.employee);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.callingnameField.pristine){ this.callingnameField.patchValue(this.employee.callingname); }
    if (this.fullnameField.pristine){ this.fullnameField.patchValue(this.employee.fullname); }
    if (this.dobirthField.pristine){ this.dobirthField.patchValue(this.employee.dobirth); }
    if (this.nicField.pristine){ this.nicField.patchValue(this.employee.nic); }
    if (this.mobileField.pristine){ this.mobileField.patchValue(this.employee.mobile); }
    if (this.landField.pristine){ this.landField.patchValue(this.employee.land); }
    if (this.addressField.pristine){ this.addressField.patchValue(this.employee.address); }
    if (this.emailField.pristine){ this.emailField.patchValue(this.employee.email); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.employee.description); }
    if (this.dorecruiteField.pristine){ this.dorecruiteField.patchValue(this.employee.dorecruite); }
    if (this.genderField.pristine){ this.genderField.patchValue(this.employee.gender.id); }
    if (this.civilstatusField.pristine){ this.civilstatusField.patchValue(this.employee.civilstatus.id); }
    if (this.designationField.pristine){ this.designationField.patchValue(this.employee.designation.id); }
    if (this.nametitleField.pristine){ this.nametitleField.setValue(this.employee.nametitle.id); }
    if (this.branchField.pristine){ this.branchField.patchValue(this.employee.branch.id); }
    if (this.employeestatusField.pristine){ this.employeestatusField.patchValue(this.employee.employeestatus.id); }
    if (this.photoField.pristine){
      if (this.employee.photo){
        this.photoField.patchValue([this.employee.photo]);
      }else {
        this.photoField.patchValue([]);
      }
    }
  }

  async submit(): Promise<void> {
    this.photoField.markAsTouched();
    this.photoField.updateValueAndValidity();
    if (this.form.invalid) { return; }
    const newEmployee: Employee = new Employee();
    newEmployee.callingname = this.callingnameField.value;
    newEmployee.fullname = this.fullnameField.value;
    newEmployee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    newEmployee.nic = this.nicField.value;
    newEmployee.address = this.addressField.value;
    newEmployee.mobile = this.mobileField.value;
    newEmployee.land = (this.landField.value === '') ? null : this.landField.value;
    newEmployee.description = this.descriptionField.value;
    newEmployee.dorecruite = DateHelper.getDateAsString(this.dorecruiteField.value as Date);
    newEmployee.gender = this.genderField.value;
    newEmployee.civilstatus = this.civilstatusField.value;
    newEmployee.designation = this.designationField.value;
    newEmployee.nametitle = this.nametitleField.value;
    newEmployee.email = this.emailField.value;
    newEmployee.email = this.emailField.value;
    newEmployee.employeestatus = this.employeestatusField.value;
    newEmployee.branch = this.branchField.value;
    if (this.photoField.value !== null && this.photoField.value !== []){
      newEmployee.photo = this.photoField.value ? this.photoField.value[0] : null;
    }

    try{
      const resourceLink: ResourceLink = await this.employeeService.update(this.employee.id, newEmployee);
      await this.router.navigateByUrl('/employees/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 500);
          break;
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
