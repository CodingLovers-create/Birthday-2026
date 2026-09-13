export type SortOption = 'recent' | 'popular';

export interface FilterState {
  tag: string | null;
  sort: SortOption;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  tag: null,
  sort: 'recent'
};
