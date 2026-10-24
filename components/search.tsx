'use client';

import type { ComponentProps } from 'react';
import { CornerDownLeft, FileText, SearchX, X } from 'lucide-react';
import { useStaticSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog, SearchDialogClose, SearchDialogContent, SearchDialogFooter, SearchDialogHeader,
  SearchDialogIcon, SearchDialogInput, SearchDialogList, SearchDialogListItem, SearchDialogOverlay,
  type SearchItemType, type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { withBasePath } from '@/site.config.mjs';

const quickEntries = [
  { id: 'quick-get-started', title: '审核流程', detail: '从阅读条款到提交问卷', href: '/get-started/' },
  { id: 'quick-management', title: '管理公约', detail: '行为规范与社群管理方式', href: '/basic/management/' },
  { id: 'quick-verify', title: '审核须知 · 本校区', detail: '厦门六中同安校区学生', href: '/basic/verify/' },
  { id: 'quick-verify-foreign', title: '审核须知 · 非本校区', detail: '其他学校及东渡校区学生', href: '/basic/verify-foreign/' },
];
const quickItems = quickEntries.map((entry) => ({
  id: entry.id, type: 'page' as const, content: entry.title, url: entry.href,
})) satisfies SearchItemType[];

const ResultItem: NonNullable<ComponentProps<typeof SearchDialogList>['Item']> = ({ item, ...props }) => {
  const quick = quickEntries.find((entry) => entry.id === item.id);
  return (
    <SearchDialogListItem item={item} {...props} className={quick ? 'search-result search-quick-item' : 'search-result'}>
      {quick ? (
        <>
          <span className="search-file-icon"><FileText size={17} strokeWidth={1.4} aria-hidden="true" /></span>
          <span className="search-quick-copy"><span>{quick.title}</span><span>{quick.detail}</span></span>
          <CornerDownLeft className="search-open-hint" size={15} strokeWidth={1.4} aria-hidden="true" />
        </>
      ) : undefined}
    </SearchDialogListItem>
  );
};

function EmptyResults() {
  return (
    <div className="search-empty" role="status">
      <SearchX size={22} strokeWidth={1.3} aria-hidden="true" />
      <p>没有找到相关内容</p>
      <span>换个关键词试试，例如“审核”或“问卷”。</span>
    </div>
  );
}

export default function StaticSearchDialog(props: SharedProps) {
  const search = useStaticSearch({ from: withBasePath('/search-index.json') });
  const hasQuery = search.search.trim().length > 0;
  const items = hasQuery ? search.data?.items ?? null : quickItems;
  const resultCount = search.data?.items.length ?? 0;

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay className="search-overlay" />
      <SearchDialogContent className="search-dialog" aria-describedby="search-help">
        <SearchDialogHeader className="search-header">
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose className="search-close">
            <kbd>Esc</kbd><X size={16} strokeWidth={1.5} aria-hidden="true" />
          </SearchDialogClose>
        </SearchDialogHeader>
        <div className="search-section-title">
          <span>{hasQuery ? '搜索结果' : '常用文档'}</span>
          <span role="status" aria-live="polite">{hasQuery ? (search.isLoading ? '正在搜索…' : search.data ? resultCount + ' 项结果' : '') : '输入关键词搜索全文'}</span>
        </div>
        <SearchDialogList className="search-results" items={items} Item={ResultItem} Empty={EmptyResults} />
        <SearchDialogFooter className="search-footer">
          <p id="search-help" className="search-keyboard-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd>选择</span>
            <span><kbd>↵</kbd>打开</span>
          </p>
          <span className="search-escape-hint">Esc 关闭</span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
