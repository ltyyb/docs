import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins/remark-directive-admonition';
import remarkCommunityMarkdown from './scripts/remark-community-markdown.mjs';
import remarkDirective from 'remark-directive';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'docs',
  docs: {
    schema: pageSchema.extend({
      heroImage: z.string().optional(),
      actions: z.array(z.object({
        text: z.string(),
        link: z.string(),
        type: z.enum(['primary', 'secondary']),
      })).optional(),
      footer: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: { remarkPlugins: [remarkDirective, remarkDirectiveAdmonition, remarkCommunityMarkdown] },
});
