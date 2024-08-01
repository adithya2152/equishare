import supabase from "@/utils/supabase";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = cookies();
        const uid = Number(cookieStore.get("uid")?.value);
        console.log("UID:", uid);

        if (!uid) {
            throw new Error("UID not found in cookies");
        }

        const { data, error } = await supabase
            .from('expense')
            .select('total_expense, date')
            .eq('uid', uid);

        if (error) {
            throw new Error(error.message);
        }

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Filter data for the current year
        const currentYearExpenses = data.filter(expense => {
            const expenseYear = new Date(expense.date).getFullYear();
            return expenseYear === currentYear;
        });

        const monthlyExpenses = Array(12).fill(0);
        currentYearExpenses.forEach(expense => {
            const month = new Date(expense.date).getMonth();
            monthlyExpenses[month] += expense.total_expense;
        });

        console.log("Monthly expenses for the current year:", monthlyExpenses);

        return new Response(JSON.stringify(monthlyExpenses), {
            status: 200,
        });
    } catch (error:any) {
        console.error("Error:", error);

        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { status: 500 });
    }
}
