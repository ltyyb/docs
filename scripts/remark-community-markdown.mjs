import { remarkSteps } from 'fumadocs-core/mdx-plugins/remark-steps';

// remark-directive 也会把时间中的 :00 等识别成指令；保留非提示框指令的原文。
export default function remarkCommunityMarkdown() {
  const steps = remarkSteps();
  return (tree, file) => {
    function visit(node) {
      if (['textDirective', 'leafDirective', 'containerDirective'].includes(node.type)) {
        const value = String(file).slice(node.position.start.offset, node.position.end.offset);
        if (node.type === 'textDirective') Object.assign(node, { type: 'text', value });
        else Object.assign(node, { type: 'paragraph', children: [{ type: 'text', value }] });
        delete node.name;
        delete node.attributes;
        if (node.type === 'text') delete node.children;
        return;
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
    if (file.path.replaceAll('\\', '/').endsWith('/get-started.md')) steps(tree, file);
  };
}
