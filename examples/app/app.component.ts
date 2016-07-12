import {
    Component,
    OnInit,
    ElementRef
} from '@angular/core';
import {
    REACTIVE_FORM_DIRECTIVES,
    FORM_DIRECTIVES,
    NgForm,
    AbstractControl,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import {
    DxButton,
    DxCheckBox,
    DxSwitch,
    DxTextBox,
    DxTextBoxValueAccessor,
    DxTextArea,
    DxNumberBox,
    DxDateBox,
    DxProgressBar,
    DxSlider,
    DxRangeSlider,
    DxLoadIndicator,
    DxAutocomplete,
    DxSelectBox,
    DxTagBox,
    DxRadioGroup,
    DxColorBox,
    DxCalendar,
    DxTemplate,
    DxList,
    DxPopup,
    DxChart,
    DxDataGrid
} from '../../dist/';
import {
    Orange,
    OrangeService
} from './orange.service';
import{
    Customer,
    CustomerService
} from './customer.service';

declare var $:any;

@Component({
    selector: 'my-app',
    styles: [`
        h1, h2, h3 {
            font-family: 'Helvetica Neue','Segoe UI',Helvetica,Verdana,sans-serif;
        }
        .demo-container {
            width: 400px;
        }
        .demo-container > .dx-widget {
            margin-bottom: 20px;
            -display: block;
        }
        .float-right {
            float: right;
        }
        .full-width {
            width: 100%;
            display: block;
        }
    `],
    templateUrl: "app/app.component.html",
    directives: [
        REACTIVE_FORM_DIRECTIVES,
        FORM_DIRECTIVES,
        DxButton,
        DxCheckBox,
        DxSwitch,
        DxTextBox,
        DxTextBoxValueAccessor,
        DxTextArea,
        DxNumberBox,
        DxDateBox,
        DxProgressBar,
        DxSlider,
        DxRangeSlider,
        DxLoadIndicator,
        DxAutocomplete,
        DxSelectBox,
        DxTagBox,
        DxRadioGroup,
        DxColorBox,
        DxCalendar,
        DxList,
        DxPopup,
        DxTemplate,
        DxChart,
        DxDataGrid
    ],
    providers: [
        OrangeService,
        CustomerService
    ]
})
export class AppComponent implements OnInit {
    text = "Initial text";
    email: string;
    emailControl: AbstractControl;
    password: string;
    passwordControl: AbstractControl;
    form: FormGroup;
    boolValue: boolean;
    numberValue: number;
    dateValue: Date;
    demoItems: string[];
    popupVisible = false;
    series = {
        argumentField: "day",
        valueField: "oranges",
        name: "My oranges",
        type: "bar",
        color: '#ffa500'
    };
    oranges: Orange[];
    customers: Customer[];
    constructor(private orangeService: OrangeService, private customerService: CustomerService) {
        this.text = "Text in textbox";
        this.boolValue = true;
        this.numberValue = 10;
        this.dateValue = new Date();
        this.demoItems = [
            "item1",
            "item2",
            "item3"
        ];
    }
    helloWorld() {
        alert("Hello world");
    }
    buy(model) {
        alert(model + " has been added to order");
    }
    onSubmit() {
        this.form.updateValueAndValidity();
        console.log("submitted");
        return false;
    }
    ngOnInit() {
        this.form = new FormGroup({
            emailControl: new FormControl('', Validators.compose([Validators.required, CustomValidator.mailFormat])),
            passwordControl: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
        });
        this.emailControl = this.form.controls['emailControl'];
        this.passwordControl = this.form.controls['passwordControl'];
        this.oranges = this.orangeService.getOranges();
        this.customers = this.customerService.getCustomers();
    }
}

export class CustomValidator {
    static mailFormat(control: FormControl) {
        var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (control.value && control.value.length && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "incorrectMailFormat": true };
        }

        return null;
    }
}
