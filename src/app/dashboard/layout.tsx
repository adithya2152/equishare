import "../styles/dashboard.css"
import Header from "@/components/header";
export default function DashboardLayout({
    children,
    summary,
    monthspend,
    expensecat,
    options,
    splitdetails,
}:
{children : React.ReactNode;
 summary : React.ReactNode;   
 monthspend : React.ReactNode;
 expensecat : React.ReactNode;
 options : React.ReactNode;
 splitdetails : React.ReactNode;


})
{
    return(
        <div>
           <Header/>
            {children}
            <div className="grid">
                <div className="item item1">{summary}</div>
                <div className="item item2">{monthspend}</div>
                <div className="item item3">{expensecat}</div>
                <div className="item item4">{options}</div>
                <div className="item item5">{splitdetails}</div>
            </div>
        </div>
    )
}