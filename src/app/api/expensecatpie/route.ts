
import supabase from "@/utils/supabase";

export async function GET()
{

    try {
        
        const { data, error } = await supabase
        .rpc("get_expense_category_counts")

        if (error) {
            throw new Error(error.message);
        }

        console.log("Data from Supabase:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error:any) {
        
        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { status: 500 });

    }
    


}