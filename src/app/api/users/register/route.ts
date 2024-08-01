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
        const { credentials, password } = await request.json();
        
        console.log("Received credentials in route:", credentials);

        // Check if user already exists
        const { data: existingUsers, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('full_name', credentials.username)
            .eq('email', credentials.email);

        if (selectError) {
            throw new Error(selectError.message);
        }

        if (existingUsers && existingUsers.length > 0) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400, statusText: "Bad Request" });
        }

        // Insert new user
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
                full_name: credentials.username,
                email: credentials.email,
                phone: credentials.phone,
                password: password
            })
            .select();  

        if (insertError) {
            throw new Error(insertError.message);
        }

        // Extract UID from insertData
        const uid = insertData[0]?.uid;
        if (!uid) {
            throw new Error("Failed to get UID after insertion");
        }

        console.log("UID generated:", uid);

        const uidCookie = setCookie('uid', uid.toString(), { maxAge: 3600, httpOnly: true , path:'/' });

        console.log("Generated Set-Cookie header:", uidCookie);

        return new Response(JSON.stringify({ message: "User created successfully" }), { 
            status: 201, 
            statusText: "OK",
            headers:{
                "Set-Cookie": uidCookie,
                'Content-Type': 'application/json'
            }
        });
    } catch (error: any) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, statusText: "Internal Server Error" });
    }
}
