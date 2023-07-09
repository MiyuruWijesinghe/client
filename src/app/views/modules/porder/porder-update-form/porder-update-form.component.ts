import {Component, OnInit, ViewChild} from '@angular/core';
import {Porder} from '../../../../entities/porder';
import {Nametitle} from '../../../../entities/nametitle';
import {Designation} from '../../../../entities/designation';
import {Gender} from '../../../../entities/gender';
import {Civilstatus} from '../../../../entities/civilstatus';
import {Porderstatus} from '../../../../entities/porderstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PorderService} from '../../../../services/porder.service';
import {GenderService} from '../../../../services/gender.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {DesignationService} from '../../../../services/designation.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {PorderstatusService} from '../../../../services/porderstatus.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DateHelper} from '../../../../shared/date-helper';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch} from '../../../../entities/branch';
import {Supplier} from '../../../../entities/supplier';
import {BranchService} from '../../../../services/branch.service';
import {SupplierService} from '../../../../services/supplier.service';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';
import {ItemBranchUpdateSubFormComponent} from '../../item/item-update-form/item-branch-update-sub-form/item-branch-update-sub-form.component';
import {PorderItemUpdateSubFormComponent} from './porder-item-update-sub-form/porder-item-update-sub-form.component';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {PorderDataPage} from '../../../../entities/porder-data-page';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-porder-update-form',
  templateUrl: './porder-update-form.component.html',
  styleUrls: ['./porder-update-form.component.scss']
})
export class PorderUpdateFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(PorderItemUpdateSubFormComponent) porderitemSubForm: PorderItemUpdateSubFormComponent;


  selectedId: number;
  porder: Porder;

  items: Item[] = [];
  suppliers: Supplier[] = [];
  branches: Branch[] = [];
  porderstatuses: Porderstatus[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({

    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    dorecieved: new FormControl('', [
      Validators.required
    ]),
    porderstatus: new FormControl('', [
      Validators.required
    ]),
    porderitems: new FormControl(),

  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get dorecievedField(): FormControl{
    return this.form.controls.dorecieved as FormControl;
  }
    get porderstatusField(): FormControl{
    return this.form.controls.porderstatus as FormControl;
  }

  get porderitemsField(): FormControl{
    return this.form.controls.porderitems as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private porderService: PorderService,
    private porderstatusService: PorderstatusService,
    private itemService: ItemService,
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


      if (this.porderitemsField.pristine) {
        this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
          this.items = data.content;
        }).catch( e => {
          console.log(e);
          this.snackBar.open('Something is wrong', null, {duration: 2000});
        });
      }


      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }


    if (this.porderstatusField.pristine) {
      this.porderstatusService.getAll().then((data: Porderstatus[]) => {
        this.porderstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    this.porder = await this.porderService.get(this.selectedId);
    this.setValues();

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PORDER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  discardChanges(): void{
    this.porderitemSubForm.resetForm();
    this.porderitemsField.markAsPristine();
    this.form.patchValue(this.porder);
  }

  setValues(): void{
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.porder.description); }
    if (this.dorecievedField.pristine){ this.dorecievedField.patchValue(this.porder.dorecieved); }
    if (this.porderstatusField.pristine){ this.porderstatusField.patchValue(this.porder.porderstatus.id); }
    if (this.porderitemsField.pristine){ this.porderitemsField.patchValue(this.porder.porderitemList); }

  }

  async submit(): Promise<void> {

    this.porderitemSubForm.resetForm();
    this.porderitemsField.markAsDirty();
    if (this.form.invalid) { return; }


    const newPorder: Porder = new Porder();

    newPorder.description = this.descriptionField.value;
    newPorder.dorecieved = DateHelper.getDateAsString(this.dorecievedField.value as Date);
    newPorder.porderstatus = this.porderstatusField.value;
    newPorder.porderitemList = this.porderitemsField.value;

    try{
      const resourceLink: ResourceLink = await this.porderService.update(this.porder.id, newPorder);
      await this.router.navigateByUrl('/porders/' + resourceLink.id);
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
