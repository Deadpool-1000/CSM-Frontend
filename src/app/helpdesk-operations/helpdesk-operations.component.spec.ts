import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HelpdeskOperationsComponent } from "./helpdesk-operations.component"
import { NO_ERRORS_SCHEMA } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { of } from "rxjs"
import { HelpdeskOperationService } from "./service/helpdesk-operation.service"
import { TicketModel } from "../models/ticket.model"
import { MessageService } from "primeng/api"
import { AppRoutingModule } from "../app-routing.module"
import { ActivatedRoute } from "@angular/router"

const SAMPLE_TICKET: TicketModel = {
    ticket_id: "TKT1234",
    created_on: "2024-09-09T16:55:00",
    description: "Test description",
    message_from_helpdesk: {
        created_at: "2024-09-09T16:55:00",
        message: "We will get back to you soon"
    },
    status: "in_progress",
    title: "Test title"
}


describe('HelpdeskOperationsComponent', ()=>{
    let fixture: ComponentFixture<HelpdeskOperationsComponent>; // ts file, template, dom element
    let component: HelpdeskOperationsComponent;//manipulate ts file
    
    let submitButton: HTMLButtonElement;
    let messageToCustomerField: HTMLInputElement;

    const activatedRouteStub = {
        snapshot:{
            data: {
                ticket: {
                    ticket: SAMPLE_TICKET
                },
                operation: "close"
            }
        }
    }

    const helpdeskService = jasmine.createSpyObj('HelpdeskOperationService', {
        closeTicket: of(true),
        resolveTicket: of(true)
    })


    beforeEach(async ()=>{
        await TestBed.configureTestingModule({
            declarations: [HelpdeskOperationsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [FormsModule, AppRoutingModule],
            providers: [
                {provide: HelpdeskOperationService, useValue: helpdeskService},
                {provide: ActivatedRoute, useValue: activatedRouteStub},
                MessageService
            ]
        }).compileComponents()
        fixture = TestBed.createComponent(HelpdeskOperationsComponent)
        component = fixture.componentInstance
        component.ticket = SAMPLE_TICKET
        fixture.detectChanges()
        submitButton = fixture.debugElement.nativeElement.querySelector("button[type='submit']");
        messageToCustomerField = fixture.debugElement.nativeElement.querySelector("textarea[name='message_from_helpdesk']");
    })  

    it('renders without errors', ()=>{
        expect(component).toBeTruthy()
    });

    it('submits the close ticket form successfully', ()=>{
        component.operation = "close";
        messageToCustomerField.value = "Hey, your service was good."

        messageToCustomerField.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        submitButton.click();

        expect(helpdeskService.closeTicket).toHaveBeenCalled();
        
    });

    it('submits the resolve ticket form successfully', ()=>{
        component.operation = "resolve";
        messageToCustomerField.value = "Hey, your service was good."

        messageToCustomerField.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        submitButton.click();

        expect(helpdeskService.resolveTicket).toHaveBeenCalled();
        
    });

    it('disables button if the form is invalid', ()=>{
        fixture.detectChanges();

        expect(submitButton.disabled).toBeTrue();
    });

    it('should return with error message when form is invalid', ()=>{
        
        //temporarily enabling the submit button
        submitButton.disabled = false;
        submitButton.click();
        fixture.detectChanges();
        //getting the reference of the error message container
        const errorMessageContainer:HTMLDivElement = fixture.debugElement.nativeElement.querySelector(".alert");

        expect(errorMessageContainer.innerHTML.trim()).toBe("Please fill all the required fields correctly");
        expect(component.errorMessage.trim()).toBe("Please fill all the required fields correctly");
        

    });

});