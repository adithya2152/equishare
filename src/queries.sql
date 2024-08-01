create table expense(
  eid serial primary key,
  uid int ,
  expense_title text,
  expense_category text,
  total_expense float,
  date date,
  split boolean
)

create table request(
    rid serial primary key,
    eid int,
    expense_title text,
    sender_uid int ,
    reciever_uid int,
    split_method text,
    split_amt float,
    dor date,
    status text
)

create table Users(
  uid serial primary key,
  Full_Name text unique not null, 
  email text unique not null,
  phone text
)


--function to calculate average
CREATE OR REPLACE FUNCTION public.get_expense_averages(p_uid integer)
RETURNS TABLE (
  monthly_avg numeric,
  daily_avg numeric,
  yearly_avg numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH
    expense_totals AS (
      SELECT
        date_trunc('month', date) AS month,
        date_trunc('day', date) AS day,
        date_trunc('year', date) AS year,
        total_expense
      FROM
        expense
      WHERE
        expense.uid = p_uid
    ),
    monthly_totals AS (
      SELECT
        month,
        AVG(total_expense) AS avg_monthly_amount
      FROM
        expense_totals
      GROUP BY
        month
    ),
    daily_totals AS (
      SELECT
        day,
        AVG(total_expense) AS avg_daily_amount
      FROM
        expense_totals
      GROUP BY
        day
    ),
    yearly_totals AS (
      SELECT
        year,
        AVG(total_expense) AS avg_yearly_amount
      FROM
        expense_totals
      GROUP BY
        year
    )
  SELECT
    COALESCE(
      (SELECT AVG(avg_monthly_amount)::numeric FROM monthly_totals),
      0
    ) AS monthly_avg,
    COALESCE(
      (SELECT AVG(avg_daily_amount)::numeric FROM daily_totals),
      0
    ) AS daily_avg,
    COALESCE(
      (SELECT AVG(avg_yearly_amount)::numeric FROM yearly_totals),
      0
    ) AS yearly_avg;
END;
$$ LANGUAGE plpgsql;


--function for splitsum
-- Define the function to calculate the sum of split amounts
create or replace function get_pending_split_amounts(
  p_eid integer,
  p_sender_uid integer
)
returns numeric as $$
declare
  split_total numeric;
begin
  -- Execute the query and assign the result to the variable
  select
    coalesce(sum(r.split_amt), 0) into split_total
  from
    request r
  where
    r.eid = p_eid
    and r.sender_uid = p_sender_uid
    and r.status = 'pending';

  -- Return the result
  return split_total;
end;
$$ language plpgsql;
