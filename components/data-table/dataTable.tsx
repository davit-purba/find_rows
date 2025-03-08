"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { data } from "@/lib/data"
import { Data } from "@/lib/data"

export const columns: ColumnDef<Data>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => {
            const idx = row.index
            return <div className="capitalize font-medium text-md">{idx + 1}</div>
        },
    },
    {
        accessorKey: "question",
        header: "Question",
        cell: ({ row }) => (
            <div className="capitalize w-xs whitespace-normal text-md font-medium break-words">{row.getValue('question')}</div>
        ),
    },
    {
        accessorKey: "choice",
        header: "Choice",
        cell: ({ row }) => {
            const choices: string[] = row.getValue("choice");
            return (
                <ul className="list-disc list-inside space-y-1">
                    {choices.map((choice, index) => (
                        <p key={index} className="capitalize w-xs text-md font-medium whitespace-normal break-words">{choice}</p>
                    ))}
                </ul>
            );
        },
    },
    {
        accessorKey: "answer",
        header: () => <div className="text-left">Answer</div>,
        cell: ({ row }) => {
            return <div className="text-green-600 text-left text-md w-xs whitespace-normal font-medium break-words capitalize font-medium">{row.getValue('answer')}</div>
        },
    },
]

export function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [text, setText] = React.useState<string>('')

    let token = 'undefined'

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    if (token != text) {
        return <div className="w-sm space-y-2 p-4">
            <h1>Input Key</h1>
            <Input
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    }

    return (
        <div className="w-full p-10">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Find question..."
                    value={(table.getColumn("question")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("question")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <p className="mb-4 text-gray-600">{table.getRowCount()} Rows</p>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
