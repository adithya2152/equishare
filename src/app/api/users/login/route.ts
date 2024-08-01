import bcrypt from "bcryptjs";
import supabase from "@/utils/supabase";

// Utility function to create the Set-Cookie header
function setCookie(name: string, value: string, options: { maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; path?: string } = {}): string {
    const cookieParts = [`${name}=${value}`];
    if (options.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
    if (options.domain) cookieParts.push(`Domain=${options.domain}`);
    if (options.secure) cookieParts.push(`Secure`);
    if (options.httpOnly) cookieParts.push(`HttpOnly`);
    if (options.path) cookieParts.push(`Path=${options.path}`);
    return cookieParts.join('; ');
}

export async function POST(request: Request) {
    try {
        const { credentials } = await request.json();

        console.log("Received credentials in route:", credentials);

        const { data: existingUsers, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('full_name', credentials.username);

        if (selectError) {
            throw new Error(selectError.message);
        }

        if (existingUsers && existingUsers.length > 0) {
            const match = await bcrypt.compare(credentials.password, existingUsers[0].password);
            if (match) {
                const userId = existingUsers[0].uid;

                console.log("User ID:", userId);
                const uidCookie = setCookie('uid', userId.toString(), { maxAge: 3600, httpOnly: true, path: '/' });

                console.log("UID Cookie:", uidCookie);

                return new Response(JSON.stringify({ message: "Login Successful" }), {
                    status: 200,
                    headers: {
                        'Set-Cookie': uidCookie,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                return new Response(JSON.stringify({ error: "Invalid Password" }), { status: 400 });
            }
        } else {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });
        }
    } catch (error: any) {
        console.error("Error in login route:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
