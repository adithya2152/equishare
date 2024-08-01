import supabase from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
 
    const searchParams = request.nextUrl.searchParams;
    const rid = searchParams.get("rid");
    const response = searchParams.get("response");

    console.log("Request ID:", rid);
    console.log("Response:", response);
    
    if (!rid || !response) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    let data, error;

    if (response === "accept") {
      ({ data, error } = await supabase
        .from("request")
        .update({ status: "accepted" })
        .eq("rid", rid)
        .select());

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data found");
      }


      console.log("Response:", response);
      console.log("Data:", data);

      const { data: expense, error: selectError } = await supabase
      .from('expense')
      .select('total_expense')
      .eq('eid', data[0].eid)
      .eq('uid', data[0].sender_uid);

      if (selectError) {
        throw selectError;
      }

      if (!expense) {
        throw new Error('No expense found');
      }
      
       
      console.log("Expense:", expense);

      const { data: updatedExpense, error: updateError } = await supabase
      .from('expense')
      .update({ total_expense: expense[0].total_expense - data[0].split_amt })
      .eq('eid', data[0].eid)
      .eq('uid', data[0].sender_uid)
      .select();

      console.log("Updated Expense:", updatedExpense);
      if (updateError) {
        throw updateError;
      }

      if (!updatedExpense) {
        throw new Error('No expense found');
      }

      
    } else {
      ({ data, error } = await supabase
        .from("request")
        .update({ status: "rejected" })
        .eq("rid", rid)
        .select());

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No data found");
      }

      console.log("Response:", response);
      console.log("Data:", data);
    }

    return new Response(JSON.stringify({ message: `${response}` }), { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "An error occurred" }), { status: 500 });
  }
}
