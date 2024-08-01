import Card from "@/components/card";
import Link from "next/link";
import "@/app/styles/options.css";

export default function Options() {
  return (
    <Card>
      <div className="options-container">
 
        <div className="buttons-container">
          <Link  className="crazy-button" href="/addexpense">
             Add Expense
          </Link>
          <Link className="crazy-button" href="/expenselogs">
            View Expenses
          </Link>
        </div>
      </div>
    </Card>
  );
}
