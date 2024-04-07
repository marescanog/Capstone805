const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { convert } = require('html-to-text');

module.exports = class Email {
    constructor(user, url, options) {
        this.to = user.emailAddress;
        this.firstName = user.firstName??(employeeType!=null?"Hotel California Staff":"Guest");
        this.url = url;
        this.from = `Hotel California <${process.env.EMAIL_FROM}>`
        this.options = options;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production'){
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        } 

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(templateName, subject){
        // 1.) Render HTML based on handlebars template
        const templatePath = path.join(__dirname, '../views/emails/', `${templateName}.hbs`);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const html = template({
            firstName: this.firstName,
            url: this.url,
            subject,
            options: this.options
        });

        const htmlToTextoptions = {
            wordwrap: 130,
            // ...
          };

        // 2.) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html, htmlToTextoptions)
        }

        // 3.) create a transport and send email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome(){
        await this.send('welcome','Welcome to the Hotel California Family!');
    }

    async sendActivationLink(){
        await this.send('verifyEmail','Hotel California Email Activation');
    }

    async sendForgotPasswordLink(){
        await this.send('forgotPassword','Your password reset token (valid for only 10 minutes)');
    }
}