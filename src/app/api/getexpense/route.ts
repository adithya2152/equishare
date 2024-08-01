import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

export async function GET() {
    try {
        const cookieStore = cookies();
        const uid = Number(cookieStore.get("uid")?.value);

        console.log("UID:", uid);

        if (!uid) {
            throw new Error("UID not found in cookies");
        }

        const { data: Expensedata, error: SelectError } = await supabase
            .from("expense")
            .select("*")
            .eq("uid", uid);

        console.log("Expensedata:", Expensedata);
        if (SelectError) {
            throw new Error(SelectError.message);
        }

        return new Response(JSON.stringify(Expensedata), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("Error:", error.message || error);

        return new Response(JSON.stringify({ error: error.message || "An error occurred" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
