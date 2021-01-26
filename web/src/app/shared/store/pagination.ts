import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export enum ListDisplayMode {
  DEFAULT,
  POPUP
}

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
  listDisplayMode: ListDisplayMode;
}

export const initialListState: ListState = {
  editing: false,
  pages: initialPagesState,
  listDisplayMode: ListDisplayMode.DEFAULT
};

export const {
  selectAll: selectAllPages,
  selectEntities: selectAllPagesEntities,
  selectIds: selectAllPageKeys,
  selectTotal: selectPagesTotal
} = pagesAdapter.getSelectors();
