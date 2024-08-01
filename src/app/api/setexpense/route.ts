import supabase from "@/utils/supabase";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    try {
        
        const cookieStore = cookies();
        const uid = Number(cookieStore.get("uid")?.value)

        const {expense} = await request.json();

        console.log("User ID:", uid);
        console.log("Expense data:", expense);


        const { data, error } = await supabase
        .from('expense')
        .insert(
            { 
                uid: uid,
                expense_title: expense.expensetitle,
                expense_category: expense.expensecategory,
                total_expense: expense.amount,
                date: new Date().toISOString().split('T')[0],
                split: "false"
            }
        );

        if (error) {
            throw new Error(error.message);
        }

        console.log("Expense data inserted successfully");

        return new Response(JSON.stringify({ message: "Expense data inserted successfully" }), { status: 200, statusText: "OK" });

    } catch (error:any) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, statusText: "Internal Server Error" });
    }   
}