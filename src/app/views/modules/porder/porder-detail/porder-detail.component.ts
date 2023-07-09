import { Component, OnInit } from '@angular/core';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-porder-detail',
  templateUrl: './porder-detail.component.html',
  styleUrls: ['./porder-detail.component.scss']
})
export class PorderDetailComponent extends AbstractComponent implements OnInit {

  porder: Porder;
  selectedId: number;

  constructor(
    private porderService: PorderService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.porder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.porderService.delete(this.porder.id);
      await this.router.navigateByUrl('/porders');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.porder = await this.porderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PORDER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

}
