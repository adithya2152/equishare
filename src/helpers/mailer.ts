import nodemailer from "nodemailer";

const USER = process.env.NEXT_PUBLIC_USER;
const PASS = process.env.NEXT_PUBLIC_PASS;

console.log('USER:', USER);
console.log('PASS:', PASS);

type Props = {
  email:string,
  subject:string,
  text:string,
  html:string
}

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: USER,
    pass: PASS,
  },
});

export const sendEmail = async (props : Props) => {
  try {
    const mailOptions = await transport.sendMail({
      from: "ABC THE GREAT <adithyabharadwaj15@gmail.com>",
      to: props.email,
      subject: props.subject,
      text: props.text,
      html:  props.html,
    });
    console.log("mailOptions", mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
