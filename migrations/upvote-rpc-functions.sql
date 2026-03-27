-- RPC functions for upvote count management

CREATE OR REPLACE FUNCTION increment_upvotes(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET upvotes_count = upvotes_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_upvotes(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET upvotes_count = GREATEST(upvotes_count - 1, 0)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
