-- Create storage bucket for logos and brand assets
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

-- Create table for brand settings
CREATE TABLE public.brand_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  logo_url text,
  primary_color varchar(7) DEFAULT '#8B5CF6',
  secondary_color varchar(7) DEFAULT '#EC4899',
  font_family varchar(100) DEFAULT 'Inter',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on brand_settings
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_settings
CREATE POLICY "Users can view their own brand settings" 
ON public.brand_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand settings" 
ON public.brand_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand settings" 
ON public.brand_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand settings" 
ON public.brand_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for customized templates
CREATE TABLE public.customized_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  original_template_id uuid,
  name text NOT NULL,
  platform text NOT NULL,
  type text NOT NULL,
  customization_data jsonb,
  preview_image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on customized_templates
ALTER TABLE public.customized_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for customized_templates
CREATE POLICY "Users can view their own customized templates" 
ON public.customized_templates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customized templates" 
ON public.customized_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customized templates" 
ON public.customized_templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customized templates" 
ON public.customized_templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_brand_settings_updated_at
BEFORE UPDATE ON public.brand_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customized_templates_updated_at
BEFORE UPDATE ON public.customized_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for logos bucket
CREATE POLICY "Users can view all logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Users can upload their own logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);