import { of } from "rxjs";
import { AppComponent } from "./app.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { LoadingService } from "./services/loading/loading.service";
import { AuthService } from "./services/auth/auth.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('AppComponent', ()=>{
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async ()=>{
        const loadingServiceStub = {
            isLoading: of(true)
        }

        const authServiceStub = {
            autoLogin: () => true,
            clearExpirationTimer: () => true
        }

        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
                { provide: LoadingService, useValue: loadingServiceStub},
                { provide: AuthService, useValue: authServiceStub}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()


        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges()
    })

    it('must be loading by default', ()=>{
        component.ngOnInit()  
        expect(component.isLoading).toBeTrue()
    });

    it('renders app-header', ()=>{
        const header = fixture.debugElement.query(By.css("app-header"));
        expect(header).toBeTruthy();
    });

    it('renders p-toast', ()=>{
        const toast = fixture.debugElement.query(By.css("p-toast"));
        expect(toast).toBeTruthy();
    });

    it('renders progress spinner', ()=>{
        const spinner = fixture.debugElement.query(By.css("p-progressSpinner"));
        expect(spinner).toBeTruthy();
    })
})