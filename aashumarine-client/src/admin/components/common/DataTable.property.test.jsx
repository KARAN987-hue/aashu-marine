import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { DataTable } from './DataTable';

const propertyTestConfig = {
  numRuns: 100,
  verbose: true,
};

describe('DataTable Properties', () => {
  /**
   * Feature: admin-panel, Property 14: Table Pagination
   * For any data table with pagination enabled, clicking the next/previous buttons
   * should fetch and display the corresponding page of data.
   * 
   * **Validates: Requirements 7.4**
   */
  it('calls onPageChange with correct page number when pagination buttons are clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }), // current page
        fc.integer({ min: 2, max: 20 }), // total pages
        fc.integer({ min: 10, max: 100 }), // total items
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (currentPage, totalPages, total, data) => {
          cleanup();
          const onPageChange = vi.fn();
          const pagination = {
            page: currentPage,
            limit: 10,
            total,
            totalPages,
          };

          const columns = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
          ];

          render(
            <DataTable
              columns={columns}
              data={data}
              pagination={pagination}
              onPageChange={onPageChange}
            />
          );

          const user = userEvent.setup();

          // Test Previous button
          const prevButton = screen.getByRole('button', { name: /previous/i });
          if (currentPage > 1) {
            expect(prevButton).not.toBeDisabled();
            await user.click(prevButton);
            expect(onPageChange).toHaveBeenCalledWith(currentPage - 1);
          } else {
            expect(prevButton).toBeDisabled();
          }

          onPageChange.mockClear();

          // Test Next button
          const nextButton = screen.getByRole('button', { name: /next/i });
          if (currentPage < totalPages) {
            expect(nextButton).not.toBeDisabled();
            await user.click(nextButton);
            expect(onPageChange).toHaveBeenCalledWith(currentPage + 1);
          } else {
            expect(nextButton).toBeDisabled();
          }
          
          cleanup();
        }
      ),
      propertyTestConfig
    );
  }, 30000); // 30 second timeout for async test

  /**
   * Feature: admin-panel, Property 15: Table Sorting
   * For any sortable table column, clicking the column header should sort the data
   * by that column in ascending order on first click and descending order on second click.
   * 
   * **Validates: Requirements 7.5**
   */
  it('calls onSort with ascending then descending order when sortable column header is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            value: fc.integer(),
          }),
          { minLength: 2, maxLength: 20 }
        ),
        fc.constantFrom('name', 'value'), // sortable column key
        async (data, sortableKey) => {
          cleanup();
          const onSort = vi.fn();
          const columns = [
            { key: 'id', label: 'ID', sortable: false },
            { key: 'name', label: 'Name', sortable: true },
            { key: 'value', label: 'Value', sortable: true },
          ];

          render(
            <DataTable
              columns={columns}
              data={data}
              onSort={onSort}
            />
          );

          const user = userEvent.setup();
          const sortableColumn = columns.find(col => col.key === sortableKey);
          const columnHeader = screen.getByText(sortableColumn.label);

          // First click should sort ascending
          await user.click(columnHeader);
          expect(onSort).toHaveBeenCalledWith(sortableKey, 'asc');

          // Second click should sort descending
          await user.click(columnHeader);
          expect(onSort).toHaveBeenCalledWith(sortableKey, 'desc');

          // Third click should sort ascending again
          await user.click(columnHeader);
          expect(onSort).toHaveBeenCalledWith(sortableKey, 'asc');
          
          cleanup();
        }
      ),
      propertyTestConfig
    );
  }, 30000); // 30 second timeout for async test

  /**
   * Feature: admin-panel, Property 15: Table Sorting
   * Non-sortable columns should not trigger sort when clicked.
   */
  it('does not call onSort when non-sortable column header is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (data) => {
          cleanup();
          const onSort = vi.fn();
          const columns = [
            { key: 'id', label: 'ID', sortable: false },
            { key: 'name', label: 'Name', sortable: true },
          ];

          render(
            <DataTable
              columns={columns}
              data={data}
              onSort={onSort}
            />
          );

          const user = userEvent.setup();
          const nonSortableHeader = screen.getByText('ID');

          await user.click(nonSortableHeader);
          expect(onSort).not.toHaveBeenCalled();
          
          cleanup();
        }
      ),
      propertyTestConfig
    );
  }, 30000); // 30 second timeout for async test

  /**
   * Feature: admin-panel, Property 12: Loading State Display
   * When isLoading is true, the table should display a loading spinner.
   * 
   * **Validates: Requirements 7.6, 36.1**
   */
  it('displays loading spinner when isLoading is true', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string(),
          }),
          { maxLength: 10 }
        ),
        (data) => {
          cleanup();
          const columns = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
          ];

          render(
            <DataTable
              columns={columns}
              data={data}
              isLoading={true}
            />
          );

          // Should display loading spinner
          expect(screen.getByRole('status')).toBeInTheDocument();
          
          // Should not display table
          expect(screen.queryByRole('table')).not.toBeInTheDocument();
          
          cleanup();
        }
      ),
      propertyTestConfig
    );
  });

  /**
   * Feature: admin-panel, Property 14: Table Pagination
   * Pagination controls should display current page and total pages correctly.
   */
  it('displays correct pagination information', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 100 }),
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (currentPage, totalPages, data) => {
          cleanup();
          const pagination = {
            page: currentPage,
            limit: 10,
            total: totalPages * 10,
            totalPages,
          };

          const columns = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
          ];

          render(
            <DataTable
              columns={columns}
              data={data}
              pagination={pagination}
              onPageChange={vi.fn()}
            />
          );

          // Verify pagination text displays correct page numbers
          expect(screen.getByText(`Page ${currentPage} of ${totalPages}`)).toBeInTheDocument();
          
          cleanup();
        }
      ),
      propertyTestConfig
    );
  });
});
