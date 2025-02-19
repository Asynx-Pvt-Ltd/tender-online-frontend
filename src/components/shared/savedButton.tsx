"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bookmark, TrashIcon, Eye } from "lucide-react";
import Loading from "@/components/ui/loading";
import TenderDetailsDialog from "@/components/shared/TenderDetailsDialog";
import {
  formatDate,
  formatIndianRupeePrice,
} from "@/components/table/tender-columns";
import { toast } from "sonner";

export default function SavedTendersPage() {
  const [page, setPage] = useState(0);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const {
    data: savedTenders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["savedTenders", page],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/saved-tenders?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved tenders");
      }

      return response.json();
    },
  });

  const handleViewTender = (tender: any) => {
    setSelectedRowData(tender);
  };

  const handleRemoveSaved = async (tenderId: any) => {
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
        toast.error("Failed to remove tender");
      }
    } catch (error) {
      console.error("Error removing saved tender:", error);
      toast.error("Network error occurred");
    }
  };

  if (isLoading) return <Loading />;

  const totalPages = Math.ceil((savedTenders?.count || 0) / 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Bookmark className="mr-2 h-6 w-6 text-black" />
        <h1 className="text-2xl font-bold">Saved Tenders</h1>
      </div>

      {savedTenders?.result?.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tender Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedTenders.result.map((tender: any) => (
                  <TableRow key={tender._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium line-clamp-2">
                      {tender.tenderName}
                    </TableCell>
                    <TableCell>
                      {formatIndianRupeePrice(tender.tenderValue)}
                    </TableCell>
                    <TableCell>
                      {formatDate(tender.bidSubmissionDate)}
                    </TableCell>
                    <TableCell>{tender.district}</TableCell>
                    <TableCell className="text-right">
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

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {savedTenders.result.length} of {savedTenders.count} saved
              tenders
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Bookmark className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No saved tenders
          </h3>
          <p className="text-gray-500 mb-4">
            You haven't saved any tenders yet. Browse the tender list and click
            the bookmark icon to save tenders for later reference.
          </p>
          <Button
            onClick={() => (window.location.href = "/tenders")}
            className="bg-black hover:bg-gray-900"
          >
            Browse Tenders
          </Button>
        </div>
      )}

      {/* Tender Details Dialog */}
      <TenderDetailsDialog
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
      />
    </div>
  );
}
