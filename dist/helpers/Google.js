"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const TravelMode = {
    Driving: "driving",
    Transit: "transit",
};
const apiKey = "AIzaSyD4goaCKhf2T1kmA_7O_aL-M7TPnvT5IJ4";
class Google {
    constructor() { }
    calculateTravelTime({ source, destination, travelMode = TravelMode.Driving, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mode = travelMode || "driving";
                const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source}&destinations=${destination}&mode=${mode}&key=${apiKey}`;
                let response = yield axios_1.default.get(apiUrl);
                console.log(response, "response");
                const { rows } = response.data;
                console.log(JSON.stringify(rows), "rows");
                const elements = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.elements;
                if (!elements || elements.length === 0) {
                    console.log("No elements found in the response.");
                    return {};
                }
                const { duration: Gduration, distance: Gdistance } = elements[0];
                const duration = {
                    text: Gduration === null || Gduration === void 0 ? void 0 : Gduration.text,
                    in_hours: (Gduration === null || Gduration === void 0 ? void 0 : Gduration.value) / 3600,
                    in_sec: Gduration === null || Gduration === void 0 ? void 0 : Gduration.value,
                };
                const distance = {
                    text: Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.text,
                    in_meters: Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.value,
                    in_km: (Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.value) ? (Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.value) / 1000 : 0,
                    in_mile: (Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.value)
                        ? Math.round(((Gdistance === null || Gdistance === void 0 ? void 0 : Gdistance.value) / 1000 / 1.60934) * 100) / 100
                        : 0,
                };
                console.log(duration, distance, " :::::  Google");
                return { duration, distance };
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    getAddressDetails(lat, long) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(lat, long, "hfjdhjhjdgh------------------- latlng");
            try {
                const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAad0w-9p1zROAeni2JakxvkSfX_YDIkF4`;
                let response = yield axios_1.default.get(apiUrl);
                const postalCodeObj = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.results[0]) === null || _b === void 0 ? void 0 : _b.address_components.find((component) => component.types.includes("postal_code"));
                const postalCode = postalCodeObj ? postalCodeObj.long_name : null;
                const countryObj = (_d = (_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.results[0]) === null || _d === void 0 ? void 0 : _d.address_components.find((component) => component.types.includes("country"));
                const country = countryObj ? countryObj.short_name : null;
                return {
                    country,
                    postalCode,
                };
            }
            catch (err) {
                console.log(err);
                return {};
            }
        });
    }
    getCoordinatesFromZipCode(zipCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`;
                const response = yield axios_1.default.get(geocodingUrl);
                const location = response.data.results[0].geometry.location;
                return location;
            }
            catch (error) {
                console.error("Error fetching coordinates:", error.message);
                throw error;
            }
        });
    }
}
exports.default = new Google();
