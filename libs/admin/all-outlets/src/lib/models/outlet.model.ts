export class OutletList {
    id: string;
    outletName: string;
    type: string;
    totalSales: string;
    area: string;
    status: string;

    deserialize(input){
        this.id = input.id;
        this.outletName = input.outletName;
        this.type = input.outletName;
        this.area = input.area;
        this.status = input.status;
        return this;
    }
}