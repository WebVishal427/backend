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
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
require("dotenv").config();
class Helper {
    constructor() {
        this.adminId = "670e0ab46efa3af2c8726668";
    }
    generatePassword(length, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsChars = {
                digits: "1234567890",
                lowercase: "abcdefghijklmnopqrstuvwxyz",
                uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                symbols: "@$!%&",
            };
            const chars = [];
            for (let key in options) {
                if (options.hasOwnProperty(key) &&
                    options[key] &&
                    optionsChars.hasOwnProperty(key)) {
                    chars.push(optionsChars[key]);
                }
            }
            if (!chars.length)
                return "";
            let password = "";
            for (let j = 0; j < chars.length; j++) {
                password += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
            }
            if (length > chars.length) {
                length = length - chars.length;
                for (let i = 0; i < length; i++) {
                    const index = Math.floor(Math.random() * chars.length);
                    password += chars[index].charAt(Math.floor(Math.random() * chars[index].length));
                }
            }
            return password;
        });
    }
    generateRandomString(length, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsChars = {
                digits: "1234567890",
                lowercase: "abcdefghijklmnopqrstuvwxyz",
                uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            };
            const chars = [];
            for (let key in options) {
                if (options.hasOwnProperty(key) &&
                    options[key] &&
                    optionsChars.hasOwnProperty(key)) {
                    chars.push(optionsChars[key]);
                }
            }
            if (!chars.length)
                return "";
            let randomString = "";
            for (let j = 0; j < chars.length; j++) {
                randomString += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
            }
            if (length > chars.length) {
                length = length - chars.length;
                for (let i = 0; i < length; i++) {
                    const index = Math.floor(Math.random() * chars.length);
                    randomString += chars[index].charAt(Math.floor(Math.random() * chars[index].length));
                }
            }
            return randomString;
        });
    }
    generateAlphaString(length) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = [];
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random() * charactersLength);
                result.push(characters[randomIndex]);
            }
            return result.join("");
        });
    }
    sendInvoice(receiver_mail, subject, description) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log((_c = (_b = (_a = description === null || description === void 0 ? void 0 : description.items[0]) === null || _a === void 0 ? void 0 : _a.product_id) === null || _b === void 0 ? void 0 : _b.parent_id) === null || _c === void 0 ? void 0 : _c.thumbnail, "aaaaaa");
                const arr = (_d = description === null || description === void 0 ? void 0 : description.items) === null || _d === void 0 ? void 0 : _d.map((item, idx) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return `<tr>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;text-align: center;">${idx + 1}</td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">
                        <img src=${(_b = (_a = item === null || item === void 0 ? void 0 : item.product_id) === null || _a === void 0 ? void 0 : _a.parent_id) === null || _b === void 0 ? void 0 : _b.thumbnail} alt="Product Image" style="width: 100px;">
                    </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">${(_d = (_c = item === null || item === void 0 ? void 0 : item.product_id) === null || _c === void 0 ? void 0 : _c.parent_id) === null || _d === void 0 ? void 0 : _d.name} ( ${(_f = (_e = item === null || item === void 0 ? void 0 : item.product_id) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.map((itm) => (itm === null || itm === void 0 ? void 0 : itm.name) + "=" + (itm === null || itm === void 0 ? void 0 : itm.value) + ", ")})</td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">${((_g = item === null || item === void 0 ? void 0 : item.product_id) === null || _g === void 0 ? void 0 : _g.vendor_price) -
                        ((_h = item === null || item === void 0 ? void 0 : item.product_id) === null || _h === void 0 ? void 0 : _h.discount_price)} OMR </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;"> ${item === null || item === void 0 ? void 0 : item.qty} </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;"> ${(item === null || item === void 0 ? void 0 : item.qty) *
                        (((_j = item === null || item === void 0 ? void 0 : item.product_id) === null || _j === void 0 ? void 0 : _j.vendor_price) -
                            ((_k = item === null || item === void 0 ? void 0 : item.product_id) === null || _k === void 0 ? void 0 : _k.discount_price))} </td>
                </tr>`;
                });
                var emailHtml = `<!DOCTYPE html>
            <html>
                <head>
                    <title>Quickly - Invoice</title>
                </head>
                <body>
                    <table style=" width: 850px; margin: 0 auto; border: solid 1px #f1f1f1; box-shadow: 0 0 4px rgb(0 0 0 / 15%); padding: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        <p><b>Name:</b> <span>${(_e = description === null || description === void 0 ? void 0 : description.customer_id) === null || _e === void 0 ? void 0 : _e.name}</span></p>
                                        <p><b>Email :</b>  <span>${(_f = description === null || description === void 0 ? void 0 : description.customer_id) === null || _f === void 0 ? void 0 : _f.email}</span></p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p><b>Mobile:</b> <span>+${(_g = description === null || description === void 0 ? void 0 : description.customer_id) === null || _g === void 0 ? void 0 : _g.country_code} ${(_h = description === null || description === void 0 ? void 0 : description.customer_id) === null || _h === void 0 ? void 0 : _h.mobile_number}</span></p>
                                        <p><b>Order Id :</b>  <span>${description === null || description === void 0 ? void 0 : description.order_id}</span></p>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td  colspan="9">
                                    <table style="box-sizing: border-box;border-collapse: collapse;width: 100%;font-family:Arial,sans-serif;color: rgb(81,84,85);font-size: 14px;text-align: center;">
                                        <thead>
                                            <tr>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;text-align: center;">S. no</th>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;">Image</th>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;">Item</th>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;">MRP</th>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;">Qty </th>
                                            <th style="border: 0;padding: 7px;border: 1px solid #ddd;">Total </th>
                                            </tr>
                                        </thead>
                                        
                                        ${arr === null || arr === void 0 ? void 0 : arr.join("")}

                                    </table>
                                </td>
                            </tr>

                            <tr >
                                <td colspan="9" >
                                    <table style="border-collapse: collapse;width: 100%;">
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">Sub Total(Exc VAT):</span>
                                
                                            </td>
                                            <td style="
                                            width: 100px;
                                        ">  <span style="font-size: 15px; ">${(description === null || description === void 0 ? void 0 : description.total_payable) / 1.05} OMR</span></td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">Shipping :</span>

                                            </td>
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; "> 2 OMR </span>
                                            </td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">Discount:</span>
                                    
                                            </td>
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; ">${description === null || description === void 0 ? void 0 : description.discount} OMR</span>
                                            </td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">VAT:</span> 
                                        
                                            </td>
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; "> ${(description === null || description === void 0 ? void 0 : description.total_payable) -
                    (description === null || description === void 0 ? void 0 : description.total_payable) / 1.05} OMR </span>
                                            </td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">Payable Amount:</span>
                                        
                                            </td >
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; ">${(description === null || description === void 0 ? void 0 : description.total_payable) + 2} OMR</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                </tr>
                        </tbody>
                    </table>
                </body>
            </html>`;
                const browser = yield puppeteer.launch({
                    executablePath: "/usr/bin/chromium-browser",
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                    headless: true,
                });
                const page = yield browser.newPage();
                yield page.setContent(emailHtml, { waitUntil: "domcontentloaded" });
                yield page.emulateMediaType("screen");
                var filePath = `${description === null || description === void 0 ? void 0 : description.order_id}.pdf`;
                var fileName = `${description === null || description === void 0 ? void 0 : description.order_id}.pdf`;
                yield page.pdf({
                    path: filePath,
                    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
                    printBackground: true,
                    format: "A4",
                });
                yield browser.close();
                // const fileUrl = await FileUpload.uploadFileInS3(fileName, filePath);
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: `"Quickly Team" <${process.env.MAIL_USERNAME}>`,
                    to: receiver_mail,
                    subject: subject,
                    html: "<h2>Your Order Invoice</h2>",
                    attachments: [
                        {
                            filename: fileName,
                            path: filePath,
                        },
                    ],
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    else {
                        console.log("Mail has been successfully sent to your email address");
                        return true;
                    }
                });
                return true;
            }
            catch (err) {
                console.log("puppeteer Failed", err);
                return false;
            }
        });
    }
    getFileExtension(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the last part of the URL after the last '/'
            const filename = url.substring(url.lastIndexOf("/") + 1);
            // Get the file extension by getting the last part of the filename after the last '.'
            const extension = filename.substring(filename.lastIndexOf(".") + 1);
            return extension;
        });
    }
    getYearAndMonth(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const years = [];
            const months = [];
            data.forEach((obj) => {
                const createdAt = new Date(obj.created_at);
                const year = createdAt.getFullYear();
                const month = createdAt.getMonth() + 1;
                if (!years.includes(year)) {
                    years.push(year);
                }
                if (!months.includes(month)) {
                    months.push(month);
                }
            });
            return { years, months };
        });
    }
}
exports.default = new Helper();
