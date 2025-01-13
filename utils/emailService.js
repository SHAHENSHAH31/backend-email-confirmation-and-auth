const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:true,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
    }
});

const sendConfirmationEmail=async(email,confirmationToken)=>{
const confirmationUrl=`${process.env.APP_URL}/confirm-email/${confirmationToken}`;

const mailOptions={
    from:process.env.SMTP_FROM,
    to:email,
    subject: 'Confirm Your Email',
    html:` <h1>Welcome!</h1>
      <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
      <a href="${confirmationUrl}">Confirm Email</a>
      <p>This link will expire in 24 hours.</p>
    `
}
try{
await transporter.sendMail(mailOptions);
console.log('Confirmation email sent successfully')
}
catch(error){
    console.error('Error sending confirmation email:', error);
    throw error;
}
};

module.exports={sendConfirmationEmail};