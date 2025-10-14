/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw
} from "lucide-react"

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  columns: any[]
  data: TData[]
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
  onAdd?: () => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onView?: (row: TData) => void
  onExport?: () => void
  onImport?: () => void
  searchPlaceholder?: string
  title?: string
  description?: string
  showSearch?: boolean
  showFilters?: boolean
  showPagination?: boolean
  showActions?: boolean
  selectable?: boolean
  className?: string
}

export function DataTable<TData>({
  table,
  columns,
  data,
  loading = false,
  error = null,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onExport,
  onImport,
  searchPlaceholder = "Keresés...",
  title,
  description,
  showSearch = true,
  showFilters = true,
  showPagination = true,
  showActions = true,
  selectable = false,
  className,
}: DataTableProps<TData>) {
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedRows, setSelectedRows] = React.useState<TData[]>([])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    table.setGlobalFilter(value)
  }

  const handleRowAction = (action: 'view' | 'edit' | 'delete' | 'copy', row: TData) => {
    switch (action) {
      case 'view':
        onView?.(row)
        break
      case 'edit':
        onEdit?.(row)
        break
      case 'delete':
        onDelete?.(row)
        break
      case 'copy':
        // Copy row data to clipboard
        navigator.clipboard.writeText(JSON.stringify(row, null, 2))
        break
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive">Hiba történt</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Újratöltés
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 px-2", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex flex-1 items-center space-x-2">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Szűrők
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Szűrési opciók</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Aktív elemek</DropdownMenuItem>
                <DropdownMenuItem>Inaktív elemek</DropdownMenuItem>
                <DropdownMenuItem>Legutóbb módosított</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Refresh */}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Selection info */}
          {selectedRows.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {selectedRows.length} kijelölt
            </Badge>
          )}

          {/* Export/Import */}
          {onImport && (
            <Button variant="outline" size="sm" onClick={onImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {/* Add button */}
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Új elem
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-foreground h-10 px-2 py-2 whitespace-nowrap text-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                      }
                    </TableHead>
                  ))}
                  {showActions && <TableHead className="text-right font-semibold text-foreground h-10 px-2 py-2 whitespace-nowrap text-xs">Műveletek</TableHead>}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`} className="hover:bg-transparent">
                    {columns.map((_, colIndex) => (
                      <TableCell key={`loading-cell-${colIndex}`} className="h-12 px-2 py-2">
                        <div className="h-4 animate-pulse rounded-md bg-muted" />
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell className="h-12 px-2 py-2">
                        <div className="h-4 w-8 animate-pulse rounded-md bg-muted ml-auto" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/40 transition-colors border-b last:border-b-0 h-12"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-2 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell className="text-right px-4 py-4 align-middle">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Műveletek megnyitása</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => handleRowAction('view', row.original)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Megtekintés
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => handleRowAction('edit', row.original)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Szerkesztés
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleRowAction('copy', row.original)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Másolás
                            </DropdownMenuItem>
                            {onDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleRowAction('delete', row.original)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Törlés
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length + (showActions ? 1 : 0)} className="h-32 px-4 py-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="rounded-full bg-muted p-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Nincs adat</p>
                        <p className="text-sm text-muted-foreground">
                          Nincsenek megjeleníthető elemek.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} sor kijelölve.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Sorok oldalanként</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} oldal
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Előző oldal</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Következő oldal</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
