import { OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { Orange, OrangeService } from './orange.service';
import { Customer, CustomerService } from './customer.service';
export declare class AppComponent implements OnInit {
    private orangeService;
    private customerService;
    text: string;
    email: string;
    emailControl: AbstractControl;
    password: string;
    passwordControl: AbstractControl;
    form: FormGroup;
    boolValue: boolean;
    numberValue: number;
    dateValue: Date;
    demoItems: string[];
    popupVisible: boolean;
    series: {
        argumentField: string;
        valueField: string;
        name: string;
        type: string;
        color: string;
    };
    oranges: Orange[];
    customers: Customer[];
    constructor(orangeService: OrangeService, customerService: CustomerService);
    helloWorld(): void;
    buy(model: any): void;
    onSubmit(): boolean;
    ngOnInit(): void;
}
export declare class CustomValidator {
    static mailFormat(control: FormControl): {
        "incorrectMailFormat": boolean;
    };
}
