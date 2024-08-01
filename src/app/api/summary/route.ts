import supabase from "@/utils/supabase";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const cookieStore = cookies();
        const uidStr = cookieStore.get("uid")?.value;
        const uid = Number(uidStr);

        if (isNaN(uid)) {
            throw new Error('Invalid user ID');
        }

        console.log("User ID from cookie:", uidStr);  
        console.log("User ID converted to number:", uid);  

    
        const { data: expenses, error: selectError } = await supabase
        .rpc('get_expense_averages', { p_uid: uid });

        
        console.log("Expenses from Supabase:", expenses);
        console.log("Error from Supabase:", selectError);

        if (selectError) {
            throw new Error(selectError.message);
        }

        if (!expenses || expenses.length === 0) {
            throw new Error('No data returned from function');
        }

   
        const parsedExpenses = {
            monthly_avg: parseFloat(expenses[0].monthly_avg),
            daily_avg: parseFloat(expenses[0].daily_avg),
            yearly_avg: parseFloat(expenses[0].yearly_avg),
        };
 
        return new Response(JSON.stringify(parsedExpenses), {
            status: 200,
        });
    } catch (error: any) {
        console.error("Error:", error.message || error);

        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { status: 500 });
    }
}
