

export interface PaginationProps<T>{
    items: T[];
    itemsPerPage: number;
    children: (paginatedItems: T[]) => React.ReactNode;
}