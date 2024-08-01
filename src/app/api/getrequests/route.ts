import supabase from "@/utils/supabase"
import { cookies } from "next/headers"

export async function GET() {
    try {
        const cookieStore = cookies();
        const uid = cookieStore.get('uid')?.value;

        if (!uid) {
            throw new Error('UID not found in cookies');
        }
      
        console.log('UID:', uid);  
        const { data: user, error: selectError } = await supabase
            .from('users')
            .select('full_name')
            .eq('uid', uid)
            .single();

        if (selectError) {
            throw selectError;
        }

        if (!user) {
            throw new Error('No user found');
        }

        const { data, error } = await supabase
            .from('request')
            .select('*')
            .eq('reciever_uid', uid)
            .eq('status', 'pending')
            .order('dor', { ascending: false });

        console.log('Request data:', data, user);  

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('No data found');
        }

        const responsePayload = {
            user,
            requests: data,
        };

        return new Response(JSON.stringify(responsePayload), { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);  
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
