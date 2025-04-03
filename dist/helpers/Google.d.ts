declare class Google {
    constructor();
    calculateTravelTime({ source, destination, travelMode, }: {
        source: any;
        destination: any;
        travelMode?: string;
    }): Promise<any>;
    getAddressDetails(lat: any, long: any): Promise<{
        country: any;
        postalCode: any;
    } | {
        country?: undefined;
        postalCode?: undefined;
    }>;
    getCoordinatesFromZipCode(zipCode: any): Promise<any>;
}
declare const _default: Google;
export default _default;
