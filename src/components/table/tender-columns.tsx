"use client";

import { useRouter } from "next/router";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Your format functions (unchanged)
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const year = date.getUTCFullYear().toString().slice(-2);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate().toString().padStart(2, "0");
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours
    .toString()
    .padStart(2, "0")}:${minutes} ${ampm}`;
};

export function formatIndianRupeePrice(amount: any): string {
  if (
    amount === undefined ||
    amount === null ||
    amount === 0 ||
    Number.isNaN(amount)
  ) {
    return "Refer the document";
  }

  const numAmount = Number(String(amount).replace(/,/g, ""));
  if (Number.isNaN(numAmount)) {
    return "Refer the document";
  }

  const formatWithUnits = (value: number): string => {
    if (value >= 1e7) {
      const crore = value / 1e7;
      return `${crore.toFixed(2).replace(/\.00$/, "")} Crore`;
    } else if (value >= 1e5) {
      const lakh = value / 1e5;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakh`;
    }
    return value.toLocaleString("en-IN");
  };

  return `₹${formatWithUnits(numAmount)}`;
}

// Save tender button component
const SaveTenderButton = ({ tenderId }: { tenderId: string }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if tender is saved on component mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/check-saved-tender`,
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
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [tenderId]);

  const toggleSavedStatus = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event

    if (isLoading) return;

    setIsLoading(true);
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
        const result = await response.json();
        setIsSaved(!isSaved);
        toast.success(result.message);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to save tender");
      }
    } catch (error) {
      console.error("Error saving tender:", error);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleSavedStatus}
      disabled={isLoading}
      title={isSaved ? "Remove from saved" : "Save tender"}
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5 text-black" />
      ) : (
        <Bookmark className="h-5 w-5 text-gray-500 hover:text-black" />
      )}
    </Button>
  );
};

export default function TenderColumns() {
  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="rounded"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          title="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="rounded"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          title="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) =>
        `${row.department} - ${row.tenderName} - ${row.classification}`,
      header: "Tender Information",
      cell: ({ row }) => {
        const department = row.original.department;
        const tenderName = row.original.tenderName;
        const classification = row.original.classification;

        return (
          <div className="flex items-center justify-between min-w-60 gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900" title="Department">
                {/* {department} */}
              </span>
              <span
                className="text-xs line-clamp-2 whitespace-break-spaces font-bold text-gray-900"
                title="Tender Title"
              >
                {tenderName}
              </span>
            </div>

            <span
              className="bg-[#ECFDF3] text-[#027A48] gap-1 border rounded-full flex items-center w-max px-2 text-[9px] font-bold whitespace-nowrap"
              title="Classification"
            >
              <div className="bg-green-500 rounded-full w-1 h-1" />
              {classification}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "sub-industry",
      header: ({ column }) => (
        <div className="ml-3 text-xs text-gray-500" title="Sub-Industry">
          Sub-Industry
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="Sub-Industry">
          {row.original.subIndustry}
        </div>
      ),
    },
    {
      accessorKey: "bidSubmissionDate",
      header: ({ column }) => (
        <Button
          className="text-xs text-gray-500"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          title="Sort by Bid Submission Date"
        >
          Bid Submission Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="ml-3 w-32 text-center text-xs"
          title="Bid Submission Date"
        >
          {formatDate(row.getValue("bidSubmissionDate"))}
        </div>
      ),
    },
    {
      accessorKey: "district",
      header: ({ column }) => (
        <div className="ml-4 text-xs text-gray-500" title="District">
          District
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="District">
          {row.getValue("district")}
        </div>
      ),
    },
    {
      accessorKey: "emdValue",
      header: ({ column }) => (
        <div className="ml-3 text-xs text-gray-500" title="EMD Value">
          EMD Value
        </div>
      ),
      cell: ({ row }) => (
        <div className="line-clamp-2 text-center text-xs" title="EMD Value">
          {row.original.EMDAmountin}
        </div>
      ),
    },
    {
      accessorKey: "tenderValue",
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center text-xs text-gray-500"
          variant="ghost"
          title="Tender Value (₹)"
        >
          Tender Value (₹)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div title="Tender Value (₹)" className="text-center">
          {formatIndianRupeePrice(row.getValue("tenderValue"))}
        </div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const valueA = Number(
          String(rowA.getValue(columnId)).replace(/,/g, "")
        );
        const valueB = Number(
          String(rowB.getValue(columnId)).replace(/,/g, "")
        );

        return valueA - valueB;
      },
    },
    {
      id: "save",
      header: "Actions",
      cell: ({ row }) => <SaveTenderButton tenderId={row.original._id} />,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return columns;
}
