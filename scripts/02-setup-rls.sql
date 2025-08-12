-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Wiki pages policies
CREATE POLICY "Anyone can view published pages" ON public.wiki_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create pages" ON public.wiki_pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update own pages" ON public.wiki_pages
  FOR UPDATE USING (auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Admins and moderators can delete pages" ON public.wiki_pages
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

-- Page revisions policies
CREATE POLICY "Anyone can view page revisions" ON public.page_revisions
  FOR SELECT USING (true);

CREATE POLICY "System can insert revisions" ON public.page_revisions
  FOR INSERT WITH CHECK (true);

-- Moderation queue policies
CREATE POLICY "Authors can view own submissions" ON public.moderation_queue
  FOR SELECT USING (auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Authenticated users can submit for moderation" ON public.moderation_queue
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Moderators can update queue items" ON public.moderation_queue
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));
