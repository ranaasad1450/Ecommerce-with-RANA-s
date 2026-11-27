-- Run once in Supabase SQL Editor to enable customer order tracking.
-- Customers can only see the status for an order when BOTH order number and phone match.
CREATE OR REPLACE FUNCTION public.track_customer_order(p_order_number text, p_phone text)
RETURNS TABLE(order_number text, status text, updated_at timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.order_number::text, COALESCE(o.status, 'Pending')::text, o.created_at
  FROM public.orders AS o
  WHERE upper(trim(o.order_number)) = upper(trim(p_order_number))
    AND regexp_replace(o.phone, '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g')
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.track_customer_order(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.track_customer_order(text, text) TO anon, authenticated;
