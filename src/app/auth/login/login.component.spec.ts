import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing"
import { LoginComponent } from "./login.component"
import { AuthService } from "../../services/auth/auth.service";
import { of, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { FormsModule, NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Text } from "../../statics/text";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";


describe("LoginComponent", ()=>{
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let loginForm: HTMLFormElement;
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let customerRoleInput: HTMLInputElement;
    let employeeRoleInput: HTMLInputElement;
    let submitButton: HTMLButtonElement;

    const authServiceSpy = jasmine.createSpyObj("AuthService", {
        login: of(true)
    });

    const routerSpy = {
        navigate: jasmine.createSpy("navigate").and.callFake(()=>{
            console.log("hello1 122222")
        })
    };

    const messageServiceSpy = jasmine.createSpyObj("MessageService", {
        add: true
    })

    const activatedRouteStub = {
        snapshot: {
            queryParamMap: {
                get: ()=>"hello"
            }
        }
    }

    beforeEach(async ()=>{
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [
                {provide: AuthService, useValue: authServiceSpy},
                {provide: MessageService, useValue: messageServiceSpy},
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                {provide: Router, useValue: routerSpy}
            ],
            imports: [FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        loginForm = fixture.debugElement.nativeElement.querySelector("form");
        emailInput = fixture.debugElement.nativeElement.querySelector("input[name='email']");
        passwordInput = fixture.debugElement.nativeElement.querySelector("input[name='password']");
        customerRoleInput = fixture.debugElement.nativeElement.querySelector("#customerRadio");
        employeeRoleInput = fixture.debugElement.nativeElement.querySelector("#employeeRadio");
        submitButton = fixture.debugElement.nativeElement.querySelector("button[type='submit']");
    });

    it('submits login form correctly', fakeAsync(()=>{
        // filling the form
        fixture.detectChanges();
        flush();
        spyOn(component, "handleLogin").and.callThrough();

        emailInput.value = "test@gmail.com";
        emailInput.dispatchEvent(new Event("input"));

        passwordInput.value = "password";
        passwordInput.dispatchEvent(new Event("input"));

        customerRoleInput.checked = true;
        customerRoleInput.dispatchEvent(new Event("change"));

        loginForm.dispatchEvent(new Event("submit"));

        fixture.detectChanges();

        expect(component.handleLogin).toHaveBeenCalled();
        expect(authServiceSpy.login).toHaveBeenCalledWith("test@gmail.com", "password", "customer");
        discardPeriodicTasks();
    }));

    it('displays error message on input touched', ()=>{
        fixture.detectChanges();
        expect(submitButton.disabled).toBeTrue();
        const emailInputDebug: DebugElement = fixture.debugElement.query(By.css("input[name='email']"));
        const emailInputNgModel: NgModel = emailInputDebug.references["email"];
        const passwordInputDebug: DebugElement = fixture.debugElement.query(By.css("input[name='password']"))
        const passwordInputNgModel: NgModel = passwordInputDebug.references["password"];

        emailInputNgModel.control.markAsDirty();
        emailInputNgModel.control.markAsTouched();
        
        passwordInputNgModel.control.markAllAsTouched();
        passwordInputNgModel.control.markAsDirty();
        
        fixture.detectChanges();
        
        const errorMessageDivs: NodeList = fixture.debugElement.nativeElement.querySelectorAll(".invalid-message");
        const emailErrorDiv: HTMLDivElement =<HTMLDivElement>errorMessageDivs.item(0);
        const passwordErrorDiv: HTMLDivElement = <HTMLDivElement>errorMessageDivs.item(1);

        if(emailErrorDiv){
            expect(emailErrorDiv.innerHTML.trim()).toBe("*Please enter your email.");
        } else fail("email error message not shown");

        if(passwordErrorDiv){
            expect(passwordErrorDiv.innerHTML.trim()).toBe("*Please enter your password.");
        } else fail("password error message not shown");

        expect(submitButton.disabled).toBeTrue();
    });

    it('displays error message toast on login api error', ()=>{
        authServiceSpy.login.and.returnValue(throwError("some problem signing you in, please try again later"));
        emailInput.value = "test@gmail.com";
        emailInput.dispatchEvent(new Event("input"));
        
        passwordInput.value = "password";
        passwordInput.dispatchEvent(new Event("input"));
        
        customerRoleInput.checked = true;
        customerRoleInput.dispatchEvent(new Event("change"));
        loginForm.dispatchEvent(new Event("submit"));
        
        fixture.detectChanges();
        
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: Text.ERROR,
            detail: "some problem signing you in, please try again later"
        });

    });
});
