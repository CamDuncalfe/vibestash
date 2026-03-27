export interface Product {
  id: string;
  title: string;
  slug: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  screenshots: string[];
  maker_name: string | null;
  maker_url: string | null;
  maker_avatar_url: string | null;
  maker_twitter: string | null;
  tools_used: string[];
  categories: string[];
  tech_stack: string[];
  featured: boolean;
  featured_at: string | null;
  submitted_by: string | null;
  approved: boolean;
  approved_at: string | null;
  views_count: number;
  likes_count: number;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  url: string | null;
  logo_url: string | null;
  description: string | null;
  products_count: number;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  product_id: string;
  added_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Upvote {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Submission {
  id: string;
  user_id: string | null;
  product_url: string;
  product_name: string | null;
  comments: string | null;
  tools_used: string[];
  maker_name: string | null;
  maker_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
}

export interface ProductTool {
  product_id: string;
  tool_id: string;
}
