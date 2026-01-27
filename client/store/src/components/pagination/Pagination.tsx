import  { useState } from 'react'
import Button from '../button/Button';
import type { PaginationProps } from './Pagination.types';

const Pagination= <T,>({items,itemsPerPage, children}:PaginationProps<T>) => {


    const ITEMS_PER_PAGE = itemsPerPage;

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  return (
    <>
        {children(paginatedItems)}
        <div className="flex justify-center items-center gap-4 mt-4">
  <Button
    type="button"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => prev - 1)}
  >
    Prev
  </Button>

  <span className="text-sm">
    Page {currentPage} of {totalPages}
  </span>

  <Button
    type="button"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(prev => prev + 1)}
  >
    Next
  </Button>
</div>
    </>
  )
}

export default Pagination