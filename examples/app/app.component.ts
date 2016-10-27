import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import {
    Orange,
    OrangeService
} from './orange.service';
import{
    Customer,
    CustomerService
} from './customer.service';
import{
    Appointment,
    AppointmentService
} from './appointment.service';
import{
    OwnerService
} from './owner.service';
import{
    DxPopoverComponent
} from '../../dist';

declare let $: any;

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
        .scroll-view-height {
            height: 200px;
            display: block;
        }
        .resizable {
            display: block; 
            background-color: #ccc;
        }
        .tab-content {
            text-align: justify;
            margin-top: 25px;
        }
        #tabs {
            margin-top: 60px;
        }
        .tabpanel-item {
            height: 200px;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            padding-left: 25px;
            padding-top: 55px;
        }
        .tabpanel-item  > div {
            float: left;
            padding: 0 85px 10px 10px
        }
        .tabpanel-item  p {
            font-size: 16px;
        }
        .form-group {
            margin-bottom: 10px;
        }
    `],
    templateUrl: 'app/app.component.html',
    providers: [
        OrangeService,
        CustomerService,
        AppointmentService,
        OwnerService
    ]
})
export class AppComponent implements OnInit {
    @ViewChild(DxPopoverComponent) popover: DxPopoverComponent;
    text = 'Initial text';
    email: string;
    emailControl: AbstractControl;
    password: string;
    passwordControl: AbstractControl;
    dxValidationRules = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Email is invalid.' }
        ],
        password: [
            { type: 'required', message: 'Email is required.' }
        ]
    };
    form: FormGroup;
    boolValue: boolean;
    numberValue: number;
    dateValue: Date;
    currentDate: Date;
    demoItems: string[];
    popupVisible = false;
    series = {
        argumentField: 'day',
        valueField: 'oranges',
        name: 'My oranges',
        type: 'bar',
        color: '#ffa500'
    };
    oranges: Orange[];
    customers: Customer[];
    appointments: Appointment[];
    resources: any[];
    tabs = [
        {
            id: 0,
            text: 'user',
            icon: 'user',
            content: 'User tab content'
        }, {
            id: 1,
            text: 'comment',
            icon: 'comment',
            content: 'Comment tab content'
        }, {
            id: 2,
            text: 'find',
            icon: 'find',
            content: 'Find tab content'
        }
    ];
    tabPanelItems: Customer[];
    tabContent: string;
    constructor(private orangeService: OrangeService,
        private customerService: CustomerService,
        private appointmentService: AppointmentService,
        private ownerService: OwnerService) {
        this.text = 'Text in textbox';
        this.boolValue = true;
        this.numberValue = 10;
        this.dateValue = new Date();
        this.currentDate = new Date(2015, 4, 25);
        this.demoItems = [
            'item1',
            'item2',
            'item3'
        ];
        this.tabContent = this.tabs[0].content;
    }
    helloWorld() {
        alert('Hello world');
    }
    buy(model) {
        alert(model + ' has been added to order');
    }
    callNumber(number) {
        alert(number + ' is being called...');
    }
    onSubmit() {
        this.form.updateValueAndValidity();
        console.log('submitted');
        return false;
    }
    validate(params) {
        let result = params.validationGroup.validate();
        if (result.isValid) {
            alert('Form data is valid');
        } else {
            alert('Form data is invalid');
        }
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
        this.appointments = this.appointmentService.getAppointments();
        this.resources = [{
            field: 'OwnerId',
            allowMultiple: true,
            dataSource: this.ownerService.getOwners(),
            label: 'Owner'
        }];
        this.tabPanelItems = this.customers.slice(0, 4);
    }
    showPopover() {
        this.popover.instance.show();
    }
    selectTab(e) {
        this.tabContent = this.tabs[e.itemIndex].content;
    }
}

export class CustomValidator {
    static mailFormat(control: FormControl) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (control.value && control.value.length && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { 'incorrectMailFormat': true };
        }

        return null;
    }
}
