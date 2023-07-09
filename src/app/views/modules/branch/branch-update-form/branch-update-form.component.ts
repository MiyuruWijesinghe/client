import { Component, OnInit } from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BranchService} from '../../../../services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {BranchstatusService} from '../../../../services/branchstatus.service';
import {Branchstatus} from '../../../../entities/branchstatus';
import {DateHelper} from '../../../../shared/date-helper';
import {Notification} from '../../../../entities/notification';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {PageRequest} from "../../../../shared/page-request";

@Component({
  selector: 'app-branch-update-form',
  templateUrl: './branch-update-form.component.html',
  styleUrls: ['./branch-update-form.component.scss']
})
export class BranchUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  branch: Branch;

  branchstatuses: Branchstatus[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    contact1: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    contact2: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(255),
      Validators.email,
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    fax: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    branchstatus: new FormControl('', [
      Validators.required,
    ]),
  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get branchstatusField(): FormControl{
    return this.form.controls.branchstatus as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchService,
    private branchstatusService: BranchstatusService,
    private notificationService: NotificationService,
    private userService: UserService,
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
      this.loadDropDownData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }

    if (!this.privilege.update){ return; }

    if (this.branchstatusField.pristine) {
      this.branchstatusService.getAll().then((data: Branchstatus[]) => {
        this.branchstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    this.branch = await this.branchService.get(this.selectedId);
    this.setValues();
  }

  loadDropDownData(): any {
    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_BRANCH);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }
    const newBranch: Branch = new Branch();
    newBranch.name = this.nameField.value;
    newBranch.contact1 = this.contact1Field.value;
    newBranch.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    newBranch.email = this.emailField.value;
    newBranch.fax = (this.faxField.value === '') ? null : this.faxField.value;
    newBranch.address = this.addressField.value;
    newBranch.description = this.descriptionField.value;
    newBranch.branchstatus = this.branchstatusField.value;


    try{
      const resourceLink: ResourceLink = await this.branchService.update(this.branch.id, newBranch);
      await this.router.navigateByUrl('/branches/' + resourceLink.id);
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

  discardChanges(): void{
    this.form.patchValue(this.branch);
  }

  setValues(): void{
    if (this.nameField.pristine){ this.nameField.patchValue(this.branch.name); }
    if (this.contact1Field.pristine){ this.contact1Field.patchValue(this.branch.contact1); }
    if (this.contact2Field.pristine){ this.contact2Field.patchValue(this.branch.contact2); }
    if (this.emailField.pristine){ this.emailField.patchValue(this.branch.email); }
    if (this.faxField.pristine){ this.faxField.patchValue(this.branch.fax); }
    if (this.branchstatusField.pristine){ this.branchstatusField.patchValue(this.branch.branchstatus.id); }
    if (this.addressField.pristine){ this.addressField.patchValue(this.branch.address); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.branch.description); }
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
