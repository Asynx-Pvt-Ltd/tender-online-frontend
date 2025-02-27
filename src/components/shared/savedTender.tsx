"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 as TrashIcon, Eye, Info } from "lucide-react";
import Loading from "@/components/ui/loading";
import TenderDetailsDialog from "@/components/shared/TenderDetailsDialog";
import { formatDate, formatIndianRupeePrice } from "@/utils/utils";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/components/hook/use-media-query";

// Types
interface Tender {
  _id: string;
  tenderName: string;
  tenderValue: number;
  bidSubmissionDate: string;
  district: string;
  [key: string]: any;
}

interface SavedTendersResponse {
  result: Tender[];
  count: number;
}

// Items per page options
// const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function SavedTendersPage() {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRowData, setSelectedRowData] = useState<Tender | null>(null);

  // Responsive design helpers
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Fetch data with pagination
  const {
    data: savedTenders,
    isLoading,
    error,
    refetch,
  } = useQuery<SavedTendersResponse, Error>({
    queryKey: ["savedTenders", page, itemsPerPage],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/saved-tenders?page=${page}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch saved tenders: ${response.status}`);
        }

        const data = await response.json();

        // Handle empty results when there should be data
        if (data.count > 0 && data.result.length === 0 && page > 0) {
          // Calculate the correct last page
          const lastPage = Math.max(
            0,
            Math.ceil(data.count / itemsPerPage) - 1
          );
          setPage(lastPage);
          // This will trigger a refetch with the corrected page
          return data;
        }

        return data;
      } catch (error) {
        console.error("Error fetching saved tenders:", error);
        toast.error("Failed to fetch saved tenders");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 30000,
    retry: 1,
  });

  // Error handling
  useEffect(() => {
    if (error) {
      console.error("Query error:", error);
      toast.error("Error loading saved tenders");
    }
  }, [error]);

  // Handle view tender details
  const handleViewTender = (tender: Tender) => {
    setSelectedRowData(tender);
  };

  // Handle removing a tender from saved list
  const handleRemoveSaved = async (tenderId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/save-tender`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ tenderId }),
        }
      );

      if (response.ok) {
        toast.success("Tender removed from saved list");
        refetch();
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || "Failed to remove tender");
      }
    } catch (error) {
      console.error("Error removing saved tender:", error);
      toast.error("Network error occurred");
    }
  };

  // Calculate pagination values
  const totalItems = savedTenders?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate pagination items
  const paginationItems = useMemo(() => {
    // Start with first page
    const items = [0];

    // Add current page vicinity
    for (
      let i = Math.max(1, page - 1);
      i <= Math.min(totalPages - 2, page + 1);
      i++
    ) {
      if (!items.includes(i)) items.push(i);
    }

    // Add last page if we have more than one page
    if (totalPages > 1) {
      items.push(totalPages - 1);
    }

    // Sort items
    items.sort((a, b) => a - b);

    // Add ellipsis markers
    const result = [];
    let prev = -1;

    for (const item of items) {
      if (prev !== -1 && item > prev + 1) {
        result.push("ellipsis");
      }
      result.push(item);
      prev = item;
    }

    return result;
  }, [page, totalPages]);

  // Calculate starting item number and ending item number for display
  const startItem = totalItems ? page * itemsPerPage + 1 : 0;
  const endItem = Math.min((page + 1) * itemsPerPage, totalItems);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle items per page change
  // const handleItemsPerPageChange = (newItemsPerPage: number) => {
  //   const currentFirstItem = page * itemsPerPage;
  //   const newPage = Math.floor(currentFirstItem / newItemsPerPage);

  //   setItemsPerPage(newItemsPerPage);
  //   setPage(newPage);
  // };

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (error) {
    return (
      <Card className="container mx-auto px-4 py-8 text-center">
        <CardContent className="pt-6">
          <Info className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-4">
            Error loading saved tenders
          </h3>
          <p className="text-gray-500 mb-6">
            There was a problem fetching your saved tenders.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-black hover:bg-gray-900"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No saved tenders
  if (!savedTenders?.result?.length) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Bookmark className="mr-2 h-6 w-6 text-black" />
          <h1 className="text-2xl font-bold">Saved Tenders</h1>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="pt-10 pb-10 flex flex-col items-center">
            <Bookmark className="h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              No saved tenders
            </h3>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              You haven't saved any tenders yet. Browse the tender list and
              click the bookmark icon to save tenders for later reference.
            </p>
            <Button
              onClick={() => (window.location.href = "/tenders")}
              className="bg-black hover:bg-gray-900"
            >
              Browse Tenders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main content with saved tenders
  return (
    <div className="mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center mb-6">
        <Bookmark className="mr-2 h-6 w-6 text-black" />
        <h1 className="text-2xl font-bold">Saved Tenders</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          {/* Mobile View - Card Layout */}
          {isMobile && (
            <div className="divide-y">
              {savedTenders.result.map((tender) => (
                <div key={tender._id} className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-2">
                    {tender.tenderName}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                    <div className="text-gray-500">Value:</div>
                    <div>{formatIndianRupeePrice(tender.tenderValue)}</div>
                    <div className="text-gray-500">Submission Date:</div>
                    <div>{formatDate(tender.bidSubmissionDate)}</div>
                    <div className="text-gray-500">District:</div>
                    <div>{tender.district}</div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTender(tender)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSaved(tender._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove from saved"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tablet and Desktop View - Table Layout */}
          {!isMobile && (
            <div className="overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2 truncate">
                      Tender Name
                    </TableHead>{" "}
                    {/* Bigger column */}
                    <TableHead className="w-1/6 text-center">Value</TableHead>
                    {!isTablet && (
                      <TableHead className="w-1/6 text-center">
                        Submission Date
                      </TableHead>
                    )}
                    {!isTablet && (
                      <TableHead className="w-1/6 text-center">
                        District
                      </TableHead>
                    )}
                    <TableHead className="w-1/6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedTenders.result.map((tender) => (
                    <TableRow key={tender._id} className="hover:bg-gray-50">
                      <TableCell className="w-1/2 truncate">
                        {tender.tenderName}
                      </TableCell>{" "}
                      {/* Bigger column */}
                      <TableCell className="w-1/6 text-center">
                        {formatIndianRupeePrice(tender.tenderValue)}
                      </TableCell>
                      {!isTablet && (
                        <TableCell className="w-1/6 text-center">
                          {formatDate(tender.bidSubmissionDate)}
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell className="w-1/6 text-center">
                          {tender.district}
                        </TableCell>
                      )}
                      <TableCell className="w-1/6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTender(tender)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSaved(tender._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove from saved"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Pagination Controls */}
      <div className="flex flex-col gap-4">
        {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            Showing {startItem}-{endItem} of {totalItems} saved tenders
          </div>

          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded p-1"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        </div> */}

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 0
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      isActive={page === item}
                      onClick={() => handlePageChange(Number(item))}
                      className="cursor-pointer"
                    >
                      {Number(item) + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page >= totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Tender Details Dialog */}
      {selectedRowData && (
        <TenderDetailsDialog
          selectedRowData={selectedRowData}
          setSelectedRowData={setSelectedRowData}
        />
      )}
    </div>
  );
}
