"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onChange(selected.filter((item) => item !== value))
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const selectedOptions = selected
    .map((value) => options.find((opt) => opt.value === value))
    .filter(Boolean) as MultiSelectOption[]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-10 h-auto",
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {option.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => handleRemove(option.value, e)}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 z-[100]" 
        align="start"
        sideOffset={2}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking on modal overlay
          if ((e.target as Element).getAttribute('data-radix-dialog-overlay') !== null) {
            e.preventDefault()
          }
        }}
      >
        <div className="p-2 relative" onMouseDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Keresés..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mb-2"
          />
          <div 
            className="max-h-60 overflow-y-auto overscroll-contain relative" 
            style={{ contain: 'layout style' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <div
                    key={option.value}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(option.value)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors cursor-pointer",
                      isSelected && "bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="flex-1 text-left">{option.label}</span>
                  </div>
                )
              })
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Nincs találat
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
