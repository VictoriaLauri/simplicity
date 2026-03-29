"use client"

import * as React from "react"

import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const labelBaseClass =
  "flex items-center gap-2 text-sm leading-none font-medium select-none"

const labelDisabledClass =
  "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        labelBaseClass,
        labelDisabledClass,
        className
      )}
      {...props}
    />
  )
}

export { Label }
