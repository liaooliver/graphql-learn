import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

const total = gql`
  query {
    totalLists{
      id
      item
      remark
      created
      updated
      isFinished
    }
  }
`;

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  public result: Observable<any>;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.result = this.apollo.watchQuery({ query: total })
      .valueChanges.pipe(map(result => result.data));
    this.result.subscribe(res => console.log(res))
  }

}
