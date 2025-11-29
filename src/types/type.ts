interface IRegisterLocation{
    owner_name:string;
    garage_name:string;
    phone_number:string;
    address:string;
    latitude:number;
    longitude:number;
}
interface INearbyLocation{
    key?:string;
    owner_name:string;
    garage_name:string;
    phone_number:string;
    address:string;
    latitude:number;
    longitude:number;
    distance:number;

}
export type {IRegisterLocation , INearbyLocation};