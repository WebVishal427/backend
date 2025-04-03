import firebaseAdmin from "../config/firebase";
import _RS from "../helpers/ResponseHelper";
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
require("dotenv").config();

class Helper {
  public adminId = "670e0ab46efa3af2c8726668";

  async generatePassword(length, options) {
    const optionsChars = {
      digits: "1234567890",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      symbols: "@$!%&",
    };
    const chars = [];
    for (let key in options) {
      if (
        options.hasOwnProperty(key) &&
        options[key] &&
        optionsChars.hasOwnProperty(key)
      ) {
        chars.push(optionsChars[key]);
      }
    }

    if (!chars.length) return "";

    let password = "";

    for (let j = 0; j < chars.length; j++) {
      password += chars[j].charAt(Math.floor(Math.random() * chars[j].length));
    }
    if (length > chars.length) {
      length = length - chars.length;
      for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        password += chars[index].charAt(
          Math.floor(Math.random() * chars[index].length)
        );
      }
    }

    return password;
  }

  async generateRandomString(length, options) {
    const optionsChars = {
      digits: "1234567890",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    };
    const chars = [];
    for (let key in options) {
      if (
        options.hasOwnProperty(key) &&
        options[key] &&
        optionsChars.hasOwnProperty(key)
      ) {
        chars.push(optionsChars[key]);
      }
    }

    if (!chars.length) return "";

    let randomString = "";

    for (let j = 0; j < chars.length; j++) {
      randomString += chars[j].charAt(
        Math.floor(Math.random() * chars[j].length)
      );
    }
    if (length > chars.length) {
      length = length - chars.length;
      for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        randomString += chars[index].charAt(
          Math.floor(Math.random() * chars[index].length)
        );
      }
    }

    return randomString;
  }

  public async generateAlphaString(length: any) {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * charactersLength);
      result.push(characters[randomIndex]);
    }

    return result.join("");
  }

  async sendInvoice(receiver_mail: any, subject: any, description: any) {
    try {
      console.log(
        description?.items[0]?.product_id?.parent_id?.thumbnail,
        "aaaaaa"
      );

      const arr = description?.items?.map(
        (item, idx) =>
          `<tr>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;text-align: center;">${
                      idx + 1
                    }</td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">
                        <img src=${
                          item?.product_id?.parent_id?.thumbnail
                        } alt="Product Image" style="width: 100px;">
                    </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">${
                      item?.product_id?.parent_id?.name
                    } ( ${item?.product_id?.value?.map(
            (itm) => itm?.name + "=" + itm?.value + ", "
          )})</td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;">${
                      item?.product_id?.vendor_price -
                      item?.product_id?.discount_price
                    } OMR </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;"> ${
                      item?.qty
                    } </td>
                    <td style="border: 0;padding: 7px;border: 1px solid #ddd;"> ${
                      item?.qty *
                      (item?.product_id?.vendor_price -
                        item?.product_id?.discount_price)
                    } </td>
                </tr>`
      );

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
                                        <p><b>Name:</b> <span>${
                                          description?.customer_id?.name
                                        }</span></p>
                                        <p><b>Email :</b>  <span>${
                                          description?.customer_id?.email
                                        }</span></p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p><b>Mobile:</b> <span>+${
                                          description?.customer_id?.country_code
                                        } ${
        description?.customer_id?.mobile_number
      }</span></p>
                                        <p><b>Order Id :</b>  <span>${
                                          description?.order_id
                                        }</span></p>
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
                                        
                                        ${arr?.join("")}

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
                                        ">  <span style="font-size: 15px; ">${
                                          description?.total_payable / 1.05
                                        } OMR</span></td>
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
                                            <span style="font-size: 15px; ">${
                                              description?.discount
                                            } OMR</span>
                                            </td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">VAT:</span> 
                                        
                                            </td>
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; "> ${
                                              description?.total_payable -
                                              description?.total_payable / 1.05
                                            } OMR </span>
                                            </td>
                                        </tr>
                                        <tr style="padding: 8px;border: 1px solid #ddd;vertical-align: top;text-align: right;">
                                            <td >
                                            <span style="font-size: 14px;display: inline-block;font-weight: bold; text-align:left;">Payable Amount:</span>
                                        
                                            </td >
                                            <td style="
                                            width: 100px;
                                        ">
                                            <span style="font-size: 15px; ">${
                                              description?.total_payable + 2
                                            } OMR</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                </tr>
                        </tbody>
                    </table>
                </body>
            </html>`;

      const browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(emailHtml, { waitUntil: "domcontentloaded" });
      await page.emulateMediaType("screen");

      var filePath = `${description?.order_id}.pdf`;
      var fileName = `${description?.order_id}.pdf`;

      await page.pdf({
        path: filePath,
        margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
        printBackground: true,
        format: "A4",
      });

      await browser.close();

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
        } else {
          console.log("Mail has been successfully sent to your email address");
          return true;
        }
      });

      return true;
    } catch (err) {
      console.log("puppeteer Failed", err);
      return false;
    }
  }

  public async getFileExtension(url: any) {
    // Get the last part of the URL after the last '/'
    const filename = url.substring(url.lastIndexOf("/") + 1);

    // Get the file extension by getting the last part of the filename after the last '.'
    const extension = filename.substring(filename.lastIndexOf(".") + 1);

    return extension;
  }

  public async getYearAndMonth(data) {
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
  }
}

export default new Helper();
