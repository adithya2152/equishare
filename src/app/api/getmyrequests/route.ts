import supabase from "@/utils/supabase";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = cookies();
        const uid = cookieStore.get('uid')?.value;

        if (!uid) {
            throw new Error('UID not found in cookies');
        }

        console.log('UID:', uid);
        //extracting dat with requests current user havs sent
        const { data:requests, error } = await supabase
            .from('request')
            .select('*')
            .eq('sender_uid', uid)
            .order('dor', { ascending: false });

        if (error) {
            throw error;
        }

        if (!requests) {
            throw new Error('No requests found');
        }

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

        const {data:RecievedRequests, error: recievedError} = await supabase
            .from('request')
            .select('*')
            .eq('reciever_uid', uid)
            .neq('status', 'pending')
            .order('dor', { ascending: false });

        if (recievedError) {
            throw recievedError;
        }

        if (!RecievedRequests) {
            throw new Error('No requests found');
        }


        const responsePayload = {
            user,
            requests,
            RecievedRequests
        };

        return new Response(JSON.stringify(responsePayload), { status: 200 });
    }
    catch (error: any) 
    {
            console.error('Error:', error);
            return new Response(JSON.stringify({ error: error.message || 'An error occurred' }), { status: 500 });
        }
}