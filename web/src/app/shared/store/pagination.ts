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

export const pagesAdapter: EntityAdapter<Page> = createEntityAdapter<Page>({
  selectId: (page: Page) => page.key,
  sortComparer: false
});

export const initialPagesState: PagesState = pagesAdapter.getInitialState({
  pageLoading: false,
  pages: null,
  resultsNum: null
});

export interface ListState {
  editing: boolean;
  pages: PagesState;
}

export const initialListState = {
  editing: false,
  pages: initialPagesState
};

export const {
  selectAll: selectAllPages,
  selectEntities: selectAllPagesEntities,
  selectIds: selectAllPageKeys,
  selectTotal: selectPagesTotal
} = pagesAdapter.getSelectors();
