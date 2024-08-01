
import "../app/styles/request.css";
import toast, { Toaster } from "react-hot-toast";
 

type Props = {
  details: {
    rid: number;
    expense_title: string;
    sending_user: string;
    split_amount: string;
    split_method: string;
    date_of_request: string;
  };
};

export default function Requests(props: Props) {
  
  const { sending_user, split_amount, split_method, date_of_request, rid , expense_title} = props.details;

  console.log("Details: ", props.details);

  return (
    <div className="requests-card">
      <p className="requests-card-sending_user">Request From {sending_user}</p>
      <p className="requests-card-expense_title">Expense Title: {expense_title}</p>
      <p className="requests-card-split_amount">Amount: {split_amount}</p>
      <p className="requests-card-split_method">Split Method: {split_method}</p>
      <p className="requests-card-date_of_request">Date: {date_of_request}</p>
      <Toaster />
    </div>
  );
}
