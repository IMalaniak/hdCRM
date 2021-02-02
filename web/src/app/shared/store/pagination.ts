import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface Page {
  key: string;
  dataIds: number[];
}

export interface PagesState extends EntityState<Page> {
  pageLoading: boolean;
  pages: number;
  resultsNum: number;
}

export interface CacheState<T> {
  displayedItemCopy: T;
}

export const pagesAdapter: EntityAdapter<Page> = createEntityAdapter<Page>({
  selectId: (page: Page) => page.key,
  sortComparer: false
});

export const initialPagesState: PagesState = pagesAdapter.getInitialState({
  pageLoading: false,
  pages: null,
  resultsNum: null
});

export const initialCacheState: CacheState<unknown> = {
  displayedItemCopy: null
};

export interface ListState<T> {
  editing: boolean;
  pages: PagesState;
  cache: CacheState<T>;
}

export const initialListState: ListState<unknown> = {
  editing: false,
  pages: initialPagesState,
  cache: initialCacheState
};

export const {
  selectAll: selectAllPages,
  selectEntities: selectAllPagesEntities,
  selectIds: selectAllPageKeys,
  selectTotal: selectPagesTotal
} = pagesAdapter.getSelectors();
