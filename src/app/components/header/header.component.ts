import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input('headerObj') headerObj: any;
  constructor(private api: ApiService) { }
  logData: any;
  main_title: any;
  ngOnInit() {
    console.log('headerObj', this.headerObj)
  }

}
