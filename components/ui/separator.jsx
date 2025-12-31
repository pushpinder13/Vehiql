import * as React from "react"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
  const { decorative: _, orientation: __, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...restProps}
    />
  );
})
Separator.displayName = "Separator"

export { Separator }