-- Insert sample wiki pages (only if they don't exist)
INSERT INTO public.wiki_pages (title, slug, content, summary, status)
VALUES 
  (
    'Welcome to the Wiki',
    'welcome-to-the-wiki',
    '# Welcome to Our Wiki

This is the main page of our collaborative wiki. Here you can find information on various topics, contribute your knowledge, and help build a comprehensive resource for everyone.

## Getting Started

- **Browse**: Explore existing pages using the search function
- **Edit**: Click the edit button on any page to make improvements
- **Create**: Start new pages on topics that interest you
- **Collaborate**: Work together with other contributors

## Guidelines

Please follow these guidelines when contributing:

1. Be respectful and constructive
2. Cite your sources when possible
3. Use clear, concise language
4. Follow the established formatting conventions

Happy editing!',
    'The main welcome page explaining how to use the wiki',
    'published'
  ),
  (
    'How to Edit Pages',
    'how-to-edit-pages',
    '# How to Edit Pages

Editing pages in this wiki is simple and straightforward. Follow these steps:

## Basic Editing

1. **Click Edit**: Find the "Edit" button on any page
2. **Make Changes**: Use the editor to modify content
3. **Preview**: Review your changes before saving
4. **Save**: Submit your changes for review (if moderation is enabled)

## Formatting

We use Markdown for formatting. Here are some basics:

- **Bold text**: `**bold**`
- **Italic text**: `*italic*`
- **Headers**: `# Header 1`, `## Header 2`
- **Lists**: Use `-` or `*` for bullet points
- **Links**: `[Link text](URL)`

## Best Practices

- Write clear, informative content
- Use proper headings to structure your content
- Add summaries to help others understand changes
- Be collaborative and respectful of others'' work',
    'Guide on how to edit and format wiki pages',
    'published'
  )
ON CONFLICT (slug) DO NOTHING;
