import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MessageComponent } from "./message.component";
import { DatePipe } from "@angular/common";

describe("MessageComponent",()=>{
    let fixture: ComponentFixture<MessageComponent>;
    let component: MessageComponent;
    let cardTitle: HTMLHeadingElement;
    let cardDateHeading: HTMLHeadingElement;
    let cardText: HTMLHeadingElement;

    beforeEach(async ()=>{
        await TestBed.configureTestingModule({
            imports: [MessageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(MessageComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
        cardTitle = fixture.debugElement.nativeElement.querySelector(".card-title");
        cardDateHeading = fixture.debugElement.nativeElement.querySelector(".card-subtitle");
        cardText = fixture.debugElement.nativeElement.querySelector(".card-text");
    });


    it('should display the input messages', ()=>{
        component.title = "Hello";
        component.message = {
            created_at: "2024-09-12T12:30:00",
            message: "Hello World"
        }
        fixture.detectChanges();
        const date = new Date("2024-09-12T12:30:00");
        const datePipe = new DatePipe("en-US");
        const transformedDate = datePipe.transform(date, "medium");

        expect(cardTitle.innerHTML).toBe("Hello");
        expect(cardText.innerHTML.trim()).toBe("Hello World");
        if(transformedDate){
            expect(cardDateHeading.innerHTML).toBe(transformedDate);
        }
    });
});