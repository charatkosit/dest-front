import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitorsRoutingModule } from './visitors-routing.module';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { WebsocketService } from 'src/app/services/websocket.service';





@NgModule({
  declarations: [
    RegisterComponent,
    VisitorListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    VisitorsRoutingModule,
  ],
  providers: [WebsocketService]
})
export class VisitorsModule { }
