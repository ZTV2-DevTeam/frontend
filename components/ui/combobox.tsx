"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  allowCustomAdd?: boolean
  customAddLabel?: string
  onCustomAdd?: () => void
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  allowCustomAdd = false,
  customAddLabel = "Új hozzáadása",
  onCustomAdd,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Add custom add option to the filtered results if enabled
  const allFilteredOptions = allowCustomAdd && onCustomAdd ? [
    ...filteredOptions,
    {
      value: "__ADD_NEW__",
      label: customAddLabel,
      description: "Új elem létrehozása"
    }
  ] : filteredOptions

  // Special case: if there are no regular options but we have the add new option
  const hasOnlyAddNewOption = allowCustomAdd && onCustomAdd && filteredOptions.length === 0 && allFilteredOptions.length === 1

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [allFilteredOptions.length])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (allFilteredOptions.length > 0) {
          const selectedOption = allFilteredOptions[highlightedIndex]
          if (selectedOption.value === "__ADD_NEW__") {
            // Trigger custom add instead of selecting
            setOpen(false)
            setSearchValue("")
            onCustomAdd?.()
          } else {
            onValueChange(selectedOption.value === value ? "" : selectedOption.value)
            setOpen(false)
            setSearchValue("")
          }
        }
        break
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev < allFilteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : allFilteredOptions.length - 1
        )
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setSearchValue("")
        break
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-transparent",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
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
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            className="h-9 mb-2"
          />
          <div className="max-h-60 overflow-y-auto overscroll-contain relative" style={{ contain: 'layout style' }} onMouseDown={(e) => e.stopPropagation()}>
            {allFilteredOptions.length === 0 ? (
              <div className="py-4">
                <div className="text-center text-sm text-muted-foreground mb-3">
                  No option found.
                </div>
              </div>
            ) : (
              allFilteredOptions.map((option, index) => {
                const isAddNewOption = option.value === "__ADD_NEW__"
                const shouldShowBorder = isAddNewOption && !hasOnlyAddNewOption
                
                return (
                  <button
                    key={option.value}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      
                      if (isAddNewOption) {
                        setOpen(false)
                        setSearchValue("")
                        onCustomAdd?.()
                      } else {
                        onValueChange(option.value === value ? "" : option.value)
                        setOpen(false)
                        setSearchValue("")
                      }
                    }}
                    onMouseEnter={() => {
                      if (highlightedIndex !== index) {
                        setHighlightedIndex(index)
                      }
                    }}
                    className={cn(
                      "w-full flex flex-col items-start gap-1 px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors cursor-pointer",
                      value === option.value && "bg-accent",
                      index === highlightedIndex && "bg-muted",
                      isAddNewOption && "bg-muted/50 hover:bg-accent",
                      shouldShowBorder && "border-t border-border mt-2 pt-3"
                    )}
                  >
                    <div className="flex items-center w-full">
                      {isAddNewOption ? (
                        <div className="h-4 w-4 flex items-center justify-center mr-2 text-muted-foreground">
                          <span className="text-xs font-medium">+</span>
                        </div>
                      ) : (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      )}
                      <span className={cn(
                        "flex-1 text-left",
                        isAddNewOption && "font-medium"
                      )}>
                        {option.label}
                      </span>
                    </div>
                    {option.description && (
                      <div className={cn(
                        "text-xs ml-6 text-left text-muted-foreground",
                        isAddNewOption && "italic"
                      )}>
                        {option.description.split(' | ').map((part, partIndex) => (
                          <div key={partIndex} className={partIndex === 0 ? "font-medium" : ""}>
                            {part}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
