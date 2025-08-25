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
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions.length])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return

    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (filteredOptions.length > 0) {
          const selectedOption = filteredOptions[highlightedIndex]
          onValueChange(selectedOption.value === value ? "" : selectedOption.value)
          setOpen(false)
          setSearchValue("")
        }
        break
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
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
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 mb-2"
          />
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No option found.
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange(option.value === value ? "" : option.value)
                    setOpen(false)
                    setSearchValue("")
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "w-full flex flex-col items-start gap-1 px-2 py-2 text-sm rounded-md hover:bg-accent",
                    value === option.value && "bg-accent",
                    index === highlightedIndex && "bg-muted"
                  )}
                >
                  <div className="flex items-center w-full">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1 text-left">{option.label}</span>
                  </div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground ml-6 text-left">
                      {option.description.split(' | ').map((part, index) => (
                        <div key={index} className={index === 0 ? "font-medium" : ""}>
                          {part}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
