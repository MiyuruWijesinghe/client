import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComplainService} from '../../../../services/complain.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Complain} from '../../../../entities/complain';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Item} from '../../../../entities/item';
import {PageRequest} from '../../../../shared/page-request';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {ItemService} from '../../../../services/item.service';

@Component({
  selector: 'app-complain-form',
  templateUrl: './complain-form.component.html',
  styleUrls: ['./complain-form.component.scss']
})
export class ComplainFormComponent extends AbstractComponent implements OnInit {

  complain: Complain = new Complain();
  items: Item[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    nic: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    item: new FormControl('', [
      Validators.maxLength(65535),
    ]),
  });

  constructor(
    private complainService: ComplainService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get nameField(): FormControl {
    return this.form.controls.name as FormControl;
  }

  get nicField(): FormControl {
    return this.form.controls.nic as FormControl;
  }

  get contactField(): FormControl {
    return this.form.controls.contact as FormControl;
  }

  get addressField(): FormControl {
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get itemField(): FormControl {
    return this.form.controls.item as FormControl;
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAIN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_COMPLAINS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_COMPLAIN);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAIN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAIN);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    const complain: Complain = new Complain();
    complain.name = this.nameField.value;
    complain.nic = this.nicField.value;
    complain.contact = this.contactField.value;
    complain.address = this.addressField.value;
    complain.description = this.descriptionField.value;
    complain.item = this.itemField.value;

    try {
      const resourceLink: ResourceLink = await this.complainService.add(complain);
      await this.router.navigateByUrl('/complains/' + resourceLink.id);
    } catch (c) {
      switch (c.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(c.error.message, null, {duration: 2000});
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

}
