'use client'

import * as React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { EquipmentSchema } from '@/lib/api'

interface EquipmentDataTableProps {
  data: EquipmentSchema[]
  isAdmin: boolean
  loading?: boolean
  onEditEquipment?: (equipment: EquipmentSchema) => void
}

export function EquipmentDataTable({
  data,
  isAdmin,
  loading = false,
  onEditEquipment
}: EquipmentDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<EquipmentSchema>[] = [
    {
      accessorKey: "nickname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Becenév
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nickname")}</div>
      ),
    },
    {
      id: "brand_model",
      header: "Márka / Modell",
      cell: ({ row }) => {
        const brand = row.original.brand
        const model = row.original.model
        return (
          <div className="text-sm">
            {brand || model ? (
              <>
                {brand && <div className="font-medium">{brand}</div>}
                {model && <div className="text-muted-foreground">{model}</div>}
              </>
            ) : (
              <span className="text-muted-foreground italic">Nincs megadva</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "equipment_type",
      header: "Típus",
      cell: ({ row }) => {
        const type = row.original.equipment_type
        if (!type) return <Badge variant="outline">Nincs típus</Badge>
        return (
          <Badge variant="outline">
            {type.emoji && `${type.emoji} `}{type.name}
          </Badge>
        )
      },
    },
    {
      accessorKey: "functional",
      header: "Állapot",
      cell: ({ row }) => {
        const functional = row.getValue("functional") as boolean
        return (
          <Badge variant={functional ? "secondary" : "destructive"}>
            {functional ? "Működőképes" : "Javítás szükséges"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "serial_number",
      header: "Sorozatszám",
      cell: ({ row }) => {
        const serialNumber = row.original.serial_number
        return (
          <div className="text-sm">
            {serialNumber || <span className="text-muted-foreground italic">Nincs megadva</span>}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const equipment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü megnyitása</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log('View equipment', equipment.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Részletek
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEditEquipment?.(equipment)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Szerkesztés
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => console.log('Delete equipment', equipment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Törlés
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Becenév</TableHead>
                <TableHead>Márka / Modell</TableHead>
                <TableHead>Típus</TableHead>
                <TableHead>Állapot</TableHead>
                <TableHead>Sorozatszám</TableHead>
                <TableHead>Műveletek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6" />
                    </div>
                    <p className="text-lg font-medium mb-1">Nincs megjeleníthető felszerelés</p>
                    <p className="text-sm">
                      {data.length === 0 
                        ? 'Még nincsenek regisztrálva felszerelések' 
                        : 'Módosítsa a szűrőket más eredmények megtekintéséhez'
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} sor kiválasztva
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Előző
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Következő
          </Button>
        </div>
      </div>
    </div>
  )
}