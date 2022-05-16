export interface IAlertConcept {
    Notify(options: any): Promise<any>;
    Confirm(options: any): Promise<any>;
    Prompt(options: any): Promise<any>;
}
