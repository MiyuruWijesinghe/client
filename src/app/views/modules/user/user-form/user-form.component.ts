import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {User, UserDataPage} from '../../../../entities/user';
import {strongPassword} from '../../../../shared/validators/strong-password-validator';
import {mustMatch} from '../../../../shared/validators/must-match-validator';
import {UserService} from '../../../../services/user.service';
import {Role} from '../../../../entities/role';
import {RoleService} from '../../../../services/role.service';
import {PageRequest} from '../../../../shared/page-request';
import {PasswordGenerator} from '../../../../shared/password-generator';
import {Employee} from '../../../../entities/employee';
import {NotificationService} from '../../../../services/notification.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractComponent implements OnInit {
  passwordHide = true;
  passwordConfirmHide = true;

  employees: Employee[] = [];
  roles: Role[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    employee: new FormControl(),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(25),
      strongPassword(8, 25, 8)
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required
    ]),
    photo: new FormControl(),
    roles: new FormControl()
  }, [mustMatch('password', 'passwordConfirm')]);

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get passwordField(): FormControl{
    return this.form.controls.password as FormControl;
  }

  get passwordConfirmField(): FormControl{
    return this.form.controls.passwordConfirm as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get rolesField(): FormControl{
    return this.form.controls.roles as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.roleService.getAllBasic(new PageRequest()).then((roleDataPage) => {
      this.roles = roleDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  loadData(): any {

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.userService.getAllNonUserEmployees().then((data) => {
      this.employees = data;
    }).catch((e) => {
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_USER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_USERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_USER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_USER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_USER);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const user: User = new User();
    user.password = this.passwordField.value;
    user.roleList = this.rolesField.value;

    user.employee = this.employeeField.value;

    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      user.photo = photoIds[0];
    }else{
      user.photo = null;
    }

    try{
      const resourceLink: ResourceLink = await this.userService.add(user);
      await this.router.navigateByUrl('/users/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          if (msg.employee || msg.password){
            if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); }
            if (msg.password) { this.passwordField.setErrors({server: msg.password}); }
            break;
          }
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  generatePassword(): void{
    const password = PasswordGenerator.generate();
    this.passwordField.setValue(password);
    this.passwordConfirmField.setValue(password);
    this.passwordHide = false;
    this.passwordConfirmHide = false;
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
