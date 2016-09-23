import {
    Component,
    OnInit
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
    text = 'Initial text';
    email: string;
    emailControl: AbstractControl;
    password: string;
    passwordControl: AbstractControl;
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
