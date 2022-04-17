export class Future{
    constructor(private callback_: () => any){}
    
    public Get(){
        return this.callback_();
    }
}
