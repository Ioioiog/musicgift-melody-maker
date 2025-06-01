
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <ul
      ref={ref}
      className={cn(
        "flex flex-row items-center",
        isMobile ? "gap-1" : "gap-1",
        className
      )}
      {...props}
    />
  );
});
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  const isMobile = useIsMobile();
  
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: isMobile ? "sm" : size,
        }),
        isMobile && "min-w-[44px] min-h-[44px]", // Touch-friendly size on mobile
        className
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const isMobile = useIsMobile();
  
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={isMobile ? "sm" : "default"}
      className={cn(
        isMobile ? "px-2" : "gap-1 pl-2.5",
        isMobile && "min-w-[44px] min-h-[44px]",
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {!isMobile && <span>Previous</span>}
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const isMobile = useIsMobile();
  
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={isMobile ? "sm" : "default"}
      className={cn(
        isMobile ? "px-2" : "gap-1 pr-2.5",
        isMobile && "min-w-[44px] min-h-[44px]",
        className
      )}
      {...props}
    >
      {!isMobile && <span>Next</span>}
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  const isMobile = useIsMobile();
  
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center",
        isMobile ? "h-9 w-9" : "h-9 w-9",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
