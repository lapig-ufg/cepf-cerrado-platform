import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    //const dialogRef = this.dialog.open(PaginaIndisponivelDialog);

    const dialogRef = this.dialog.open(PaginaIndisponivelDialog, {
      width: '650px'
		});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'pagina-indisponivel-dialog',
  templateUrl: 'pagina-indisponivel-dialog.html',
})
export class PaginaIndisponivelDialog {
  constructor(
    public dialogRef: MatDialogRef<PaginaIndisponivelDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
