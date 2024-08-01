// 

import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const { expenseid, splitdata } = await request.json();
        const cookieStore = cookies();
        const uid = Number(cookieStore.get("uid")?.value);

        console.log("User ID:", uid);
        console.log("Split data:", splitdata.expense, splitdata.expensecategory, splitdata.amount, splitdata.splitmethod, splitdata.users);

        const insertSplitRequests = async (users: { id: string, splitAmt: string }[], expenseid: number, expenseTitle: string) => {
            for (const user of users) {
                console.log("User ID:", user.id);
                console.log("Split amount:", user.splitAmt);

                const { error: insertError } = await supabase
                    .from("request")
                    .insert({
                        eid: expenseid,
                        expense_title: expenseTitle,
                        sender_uid: uid,
                        reciever_uid: parseFloat(user.id),
                        split_method: splitdata.splitmethod,
                        split_amt: parseFloat(user.splitAmt),
                        dor: new Date().toISOString().split('T')[0],
                        status: "pending"
                    });

                if (insertError) {
                    throw new Error(insertError.message);
                }
                console.log("Split data inserted successfully for user ID:", user.id);
            }
        };

        if (expenseid) {
            const { data: ExpenseData, error: ExpenseInsertError } = await supabase
                .from("expense")
                .select("*")
                .eq("eid", expenseid)
                .eq("uid", uid);

            if (ExpenseInsertError) {
                throw new Error(ExpenseInsertError.message);
            }

            if (ExpenseData && ExpenseData[0] && ExpenseData[0].split === "true") {
                const { data: sumData, error: sumError } = await supabase
                    .rpc('get_pending_split_amounts', { expenseid, uid });

                if (sumError) {
                    throw new Error(sumError.message);
                }

                console.log("Sum data:", sumData);

                const splitamt = parseFloat(splitdata.totalsplitamt) + parseFloat(sumData[0].sum);
                console.log("Total split amount:", splitamt);

                if (splitamt >= parseFloat(ExpenseData[0].total_expense)) {
                    return new Response(JSON.stringify({
                        message: `Split amount ${(splitamt > parseFloat(ExpenseData[0].total_expense)) ? 'exceeds' : 'is equal to'} total expense (Previous Split requests are still pending)`
                    }), { status: 400, statusText: "Bad Request" });
                } else {
                    await insertSplitRequests(splitdata.users, expenseid, splitdata.expense.expensetitle);
                    return new Response(JSON.stringify({ message: "Split data inserted successfully" }), { status: 200, statusText: "OK" });
                }
            } else {
                const { error: expenseUpdateError } = await supabase
                    .from("expense")
                    .update({ split: "true" })
                    .eq("eid", expenseid)
                    .eq("uid", uid);

                if (expenseUpdateError) {
                    throw new Error(expenseUpdateError.message);
                }
                console.log("Expense data updated successfully");

                await insertSplitRequests(splitdata.users, expenseid, splitdata.expense.expensetitle);
                return new Response(JSON.stringify({ message: "Split data inserted successfully" }), { status: 200, statusText: "OK" });
            }
        } else {
            const { data: ExpenseData, error: ExpenseInsertError } = await supabase
                .from("expense")
                .insert({
                    uid: uid,
                    expense_title: splitdata.expense.expensetitle,
                    expense_category: splitdata.expense.expensecategory,
                    total_expense: parseFloat(splitdata.expense.amount),
                    date: new Date().toISOString().split('T')[0],
                    split: "true"
                })
                .select();

            if (ExpenseInsertError) {
                throw new Error(ExpenseInsertError.message);
            }

            console.log("Expense data inserted successfully");

            await insertSplitRequests(splitdata.users, ExpenseData[0].eid, splitdata.expense.expensetitle);
            return new Response(JSON.stringify({ message: "Split data inserted successfully" }), { status: 200, statusText: "OK" });
        }
    } catch (error: any) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, statusText: "Internal Server Error" });
    }
}
