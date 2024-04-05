import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports:[AuthRoutingModule, FormsModule, ButtonModule, CommonModule],
})
export class AuthModule{}