
-- Create storage bucket for order attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-attachments',
  'order-attachments',
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'video/mp4', 'video/webm', 'application/pdf', 'text/plain']
);

-- Create RLS policies for the storage bucket
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'order-attachments' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'order-attachments' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Admins can view all files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'order-attachments' AND
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'order-attachments' AND
  auth.role() = 'authenticated'
);

-- Create table to track uploaded files
CREATE TABLE public.order_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  addon_key TEXT NOT NULL,
  field_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on order_attachments table
ALTER TABLE public.order_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies for order_attachments
CREATE POLICY "Users can view their own attachments" ON public.order_attachments
FOR SELECT USING (uploaded_by = auth.uid());

CREATE POLICY "Users can insert their own attachments" ON public.order_attachments
FOR INSERT WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Admins can view all attachments" ON public.order_attachments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_order_attachments_updated_at
  BEFORE UPDATE ON public.order_attachments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
