import { Component, OnInit } from '@angular/core';
import {ComplainDataPage} from '../../../../entities/complain-data-page';
import {FormControl} from '@angular/forms';
import {ComplainService} from '../../../../services/complain.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Complain} from '../../../../entities/complain';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-complain-table',
  templateUrl: './complain-table.component.html',
  styleUrls: ['./complain-table.component.scss']
})
export class ComplainTableComponent extends AbstractComponent implements OnInit {

  complainDataPage: ComplainDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  nameField = new FormControl();
  nicField = new FormControl();
  contactField = new FormControl();

  constructor(
    private complainService: ComplainService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<void>{

    this.updatePrivileges();

    if (this.privilege.showAll){
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex  = this.pageIndex;
      pageRequest.pageSize  = this.pageSize;


      pageRequest.addSearchCriteria('name', this.nameField.value);
      pageRequest.addSearchCriteria('nic', this.nicField.value);
      pageRequest.addSearchCriteria('contact', this.contactField.value);

      try{
        this.complainDataPage = await this.complainService.getAll(pageRequest);
      }catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAIN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_COMPLAINS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_COMPLAIN);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAIN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAIN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'name', 'nic', 'contact'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(complain: Complain): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: complain.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.complainService.delete(complain.id);
      this.loadData();
    });
  }

}
