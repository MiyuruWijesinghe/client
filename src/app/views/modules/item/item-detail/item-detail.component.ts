import {Component, OnInit} from '@angular/core';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent extends AbstractComponent implements OnInit {
  item: Item;
  selectedId: number;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async delete(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.item.name}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.itemService.delete(this.item.id);
      await this.router.navigateByUrl('/items');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.item = await this.itemService.get(this.selectedId);
    console.log(this.item.tocreation);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_ITEM);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }


}
