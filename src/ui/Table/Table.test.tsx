import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Table from './Table';
import { getCoreRowModel, useReactTable, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import { Question } from '../../utils/types';

// Mock TableActions to check rendering count
vi.mock('./TableActions/TableActions', () => ({
  default: () => <div data-testid="table-actions">Table Actions</div>,
}));

// Mock TableSearch to check rendering count
vi.mock('./TableSearch', () => ({
  default: () => <div data-testid="table-search">Table Search</div>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  ChevronUp: () => <span>Up</span>,
  ChevronDown: () => <span>Down</span>,
  Trash2: () => <span>Trash</span>,
  Plus: () => <span>Plus</span>,
}));

// Mock Pagination
vi.mock('./Pagination/Pagination', () => ({
    default: () => <div>Pagination</div>
}));

const TestTable = () => {
    const data: Question[] = [
        { id: '1', question: 'q1', answer: 'a1', category: 'c1' } as any,
    ];

    const columns: ColumnDef<Question>[] = [
        {
            accessorKey: 'question',
            header: 'Question',
            enableColumnFilter: true,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            enableColumnFilter: true,
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return <Table data={table} />;
}

describe('Table Component', () => {
    it('renders TableActions only once even with multiple filterable columns', () => {
        render(<TestTable />);

        // This will find all instances of TableActions
        const actions = screen.getAllByTestId('table-actions');

        // With current buggy code, this should fail (it will likely be 2)
        // We assert 1 because that's the desired state.
        expect(actions).toHaveLength(1);
    });

    it('renders TableSearch for each filterable column', () => {
        render(<TestTable />);
        const searches = screen.getAllByTestId('table-search');
        expect(searches).toHaveLength(2);
    });
});
