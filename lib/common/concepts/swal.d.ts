import { IAlertConcept } from '../types/alert';
export declare class SwalAlert implements IAlertConcept {
    Notify(options: any): Promise<any>;
    Confirm(options: any): Promise<any>;
    Prompt(options: any): Promise<any>;
}
