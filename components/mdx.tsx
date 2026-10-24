import defaultComponents from 'fumadocs-ui/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { source } from '@/lib/source';

export function getMDXComponents(page: ReturnType<typeof source.getPages>[number]): MDXComponents {
  return {
    ...defaultComponents,
    a: createRelativeLink(source, page),
  };
}
