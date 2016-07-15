System.register(['@angular/core', '@angular/forms', '../../dist/', './orange.service', './customer.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, forms_1, _1, orange_service_1, customer_service_1;
    var AppComponent, CustomValidator;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (_1_1) {
                _1 = _1_1;
            },
            function (orange_service_1_1) {
                orange_service_1 = orange_service_1_1;
            },
            function (customer_service_1_1) {
                customer_service_1 = customer_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(orangeService, customerService) {
                    this.orangeService = orangeService;
                    this.customerService = customerService;
                    this.text = "Initial text";
                    this.popupVisible = false;
                    this.series = {
                        argumentField: "day",
                        valueField: "oranges",
                        name: "My oranges",
                        type: "bar",
                        color: '#ffa500'
                    };
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
                AppComponent.prototype.helloWorld = function () {
                    alert("Hello world");
                };
                AppComponent.prototype.buy = function (model) {
                    alert(model + " has been added to order");
                };
                AppComponent.prototype.onSubmit = function () {
                    this.form.updateValueAndValidity();
                    console.log("submitted");
                    return false;
                };
                AppComponent.prototype.ngOnInit = function () {
                    this.form = new forms_1.FormGroup({
                        emailControl: new forms_1.FormControl('', forms_1.Validators.compose([forms_1.Validators.required, CustomValidator.mailFormat])),
                        passwordControl: new forms_1.FormControl('', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(6)]))
                    });
                    this.emailControl = this.form.controls['emailControl'];
                    this.passwordControl = this.form.controls['passwordControl'];
                    this.oranges = this.orangeService.getOranges();
                    this.customers = this.customerService.getCustomers();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        styles: ["\n        h1, h2, h3 {\n            font-family: 'Helvetica Neue','Segoe UI',Helvetica,Verdana,sans-serif;\n        }\n        .demo-container {\n            width: 400px;\n        }\n        .demo-container > .dx-widget {\n            margin-bottom: 20px;\n            -display: block;\n        }\n        .float-right {\n            float: right;\n        }\n        .full-width {\n            width: 100%;\n            display: block;\n        }\n    "],
                        templateUrl: "app/app.component.html",
                        directives: [
                            forms_1.REACTIVE_FORM_DIRECTIVES,
                            forms_1.FORM_DIRECTIVES,
                            _1.DxButton,
                            _1.DxCheckBox,
                            _1.DxSwitch,
                            _1.DxTextBox,
                            _1.DxTextBoxValueAccessor,
                            _1.DxTextArea,
                            _1.DxNumberBox,
                            _1.DxDateBox,
                            _1.DxProgressBar,
                            _1.DxSlider,
                            _1.DxRangeSlider,
                            _1.DxLoadIndicator,
                            _1.DxAutocomplete,
                            _1.DxSelectBox,
                            _1.DxTagBox,
                            _1.DxRadioGroup,
                            _1.DxColorBox,
                            _1.DxCalendar,
                            _1.DxList,
                            _1.DxPopup,
                            _1.DxTemplate,
                            _1.DxChart,
                            _1.DxDataGrid
                        ],
                        providers: [
                            orange_service_1.OrangeService,
                            customer_service_1.CustomerService
                        ]
                    }), 
                    __metadata('design:paramtypes', [orange_service_1.OrangeService, customer_service_1.CustomerService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
            CustomValidator = (function () {
                function CustomValidator() {
                }
                CustomValidator.mailFormat = function (control) {
                    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                    if (control.value && control.value.length && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
                        return { "incorrectMailFormat": true };
                    }
                    return null;
                };
                return CustomValidator;
            }());
            exports_1("CustomValidator", CustomValidator);
        }
    }
});
//# sourceMappingURL=app.component.js.map