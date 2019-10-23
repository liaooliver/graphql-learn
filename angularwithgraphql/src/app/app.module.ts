import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ConnectComponent } from './connect/connect.component';

@NgModule({
   declarations: [
      AppComponent,
      ConnectComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      GraphQLModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
