const nodemailer = require("nodemailer");

export class MailHelper {
  constructor() {}

  static emailHtml(description: any, ar_description: any) {
    const html = `
    <html lang="en">
        <body style="font-family: 'Lato', 'Merriweather', 'Roboto', sans-serif;">
            <div className="mainEmailWraper" style="max-width: 100%; margin: 0 auto;">
                <div className="emailHeader" style="padding: 16px;background-color:#000;border-radius: 8px 8px 0 0;">
                    <div className="logoOuter" style="text-align:center;">
                    <img  src="http://103.189.173.7:1999/static/media/logo.9692be1426cf97a38b539ad31a7a9b97.svg" alt="gaines logo"  style="width:50px; border-radius: 10px" />
                    </div>
                </div>
        
                <div className="emailTempBody" style="">
                    <div style="padding: 16px; background-color: #fff; gap: 16px;">  
                    <table style="display: flex; align-items: start;width: 100%;margin: 0 auto;"> 
                    <tbody> 
                    <tr>   
                    <td valign="top" style="border: 0;padding: 10px; font-family: sans-serif;max-width: 48%;">
                           ${description}  
                         </td> 

                       
                         </tr>
                         </tobdy>
                      </table>

                    </div>
                </div>
                
                <div style="padding: 16px;font-size: 14px; background-color:#2fa68f; color: #000; text-align:center;">
                  <div style="font-size: 16px; font-weight: 600; color: #f2df33;">Get in touch</div>
                 
                  <div style="font-size: 14px; font-weight: 400; color: #0089B6;">
                  <a href="mailto:support@yopmail.com" style="text-decoration: none; color: #fff; font-size: 16px;">support@.com</a>
                  </div>
                </div>
                <div className="emailFooter" style="padding: 16px; background-color:#2fa68f; border-radius: 0 0 8px 8px; text-align: center;">
                    <div className="title" style="font-size: 14px; color: #fff; font-weight: 500;">Copyright © 2024 Gaines Platform. All rights reserved.</div>
                </div>
            </div>
        </body>
    </html>`;
    return html;
  }

  static async sendMail(
    receiver_mail: any,
    subject: any,
    html: any,
    arHtml?: any
  ) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: receiver_mail,
      subject: subject,
      html: MailHelper.emailHtml(html, arHtml),
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error while sending an email : ", error);
        return false;
      } else {
        console.log("An email has been sent successfully : ", info.response);
        return true;
      }
    });
  }
}

export default MailHelper;
