import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  const items = ['A', 'B', 'C', 'D', 'E']

  const renderPagination = () =>
    render(
      <Pagination items={items} itemsPerPage={2}>
        {(paginatedItems) => (
          <ul>
            {paginatedItems.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Pagination>
    )

  it('renders first page items initially', () => {
    renderPagination()

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.queryByText('C')).not.toBeInTheDocument()

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })

  it('navigates to next page', () => {
    renderPagination()

    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.queryByText('A')).not.toBeInTheDocument()

    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()
  })

  it('navigates back to previous page', () => {
    renderPagination()

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /prev/i }))

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
  })

  it('disables next button on last page', () => {
    renderPagination()

    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})
