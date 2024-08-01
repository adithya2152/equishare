import { sendEmail } from "@/helpers/mailer";

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


export async function POST(request: Request) {
    try {
        const { email, otp, phone } = await request.json();

        console.log("Received", email, otp, phone);

        // Validate email and phone format
        if (!validateEmail(email)) {
            return new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400, statusText: "Bad Request" });
        }

       

        try {
            await sendEmail({ email, subject: "OTP", text: `Your OTP is ${otp}`, html: `Your OTP is ${otp}` });
            console.log("Email sent successfully");
            return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200, statusText: "OK" });
        } catch (error: any) {
            console.error("Error sending email:", error);
            throw new Error(`Error sending email: ${error.message}`);
        }
    } catch (error: any) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, statusText: "Internal Server Error" });
    }
}
