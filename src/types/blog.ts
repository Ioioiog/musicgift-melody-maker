
export interface Translation {
  title: string;
  excerpt?: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  slug: string;
}

export interface BlogPostTranslations {
  [languageCode: string]: Translation;
}

export interface BlogPost {
  id: string;
  translations: BlogPostTranslations;
  default_language: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  tags?: string[];
  read_time?: number;
  views?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateBlogPostTranslations {
  [languageCode: string]: {
    title: string;
    excerpt?: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    slug?: string;
  };
}

export interface CreateBlogPostData {
  translations: CreateBlogPostTranslations;
  default_language: string;
  category: string;
  author: string;
  status?: 'draft' | 'published';
  is_featured?: boolean;
  tags?: string[];
  read_time?: number;
  views?: number;
  published_at?: string;
}
