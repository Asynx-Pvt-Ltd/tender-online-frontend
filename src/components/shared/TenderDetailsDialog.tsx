import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { formatDate, formatIndianRupeePrice } from "../table/tender-columns";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronUp,
  X,
  FileText,
  ClipboardList,
  Database,
  Building,
  Network,
  MapPin,
} from "lucide-react";
import Image from "next/image";
export interface TenderDocument {
  tenderName: string;
  description?: string;
  epublishedDate: Date;
  bidSubmissionDate: Date;
  bidOpeningDate: Date;
  tenderValue: string;
  refNo: string;
  TenderId: string;
  district: string;
  state: string;
  department: string;
  subDepartment?: string;
  location?: string;
  address?: string;
  pincode: string;
  active?: boolean;
}

const TenderDetailsDialog = ({ selectedRowData, setSelectedRowData }: any) => {
  const handleToSendTender = async (rowData: any) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/tenderRequest",
      {
        method: "POST",
        body: JSON.stringify({ data: rowData }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    if (response.ok) {
      toast.success(
        "Tender documents request sended successfully. we will reach out soon to you."
      );
      setSelectedRowData(null);
    } else {
      const data = await response.json();
      console.log(data);
      toast.error("Some error occurred");
    }
  };
  const [desOpen, setDesOpen] = React.useState(false);

  const setButtonStatus = (date: string): boolean => {
    const currentTime = new Date().getTime();
    const closingTime = new Date(date).getTime();

    if (currentTime > closingTime) return true;
    else return false;
  };
  return (
    <Dialog
      open={!!selectedRowData}
      onOpenChange={() => setSelectedRowData(null)}
    >
      <DialogContent className="max-w-[90%] lg:max-h-[90%] rounded-xl lg:max-w-3xl md:max-w-3xl md:pt-8 lg:rounded-3xl text-white bg-white">
        <button
          onClick={() => setSelectedRowData(null)}
          className="absolute lg:top-2 lg:left-0 lg:pl-3 lg:pt-2 md:top-2 md:pl-1 top-1 left-0.5 pt-1"
        >
          <X color="black" className="lg:w-6 lg:h-6 md:w-5 md:h-5" />
        </button>
        <div className="lg:px-6 px-0">
          <div className="bg-[#000000] rounded-xl lg:rounded-3xl px-2 lg:px-4 lg:p-6 py-6">
            <div className="flex lg:flex-row flex-wrap items-center justify-between w-full">
              <div className="flex  items-center gap-2">
                <div className="">
                  <FileText size={20} className="text-white" />
                </div>
                <div className="">
                  <p className="lg:text-sm text-[10px] font-normal">
                    Reference No.
                  </p>
                  <h2 className="lg:text-sm text-[10px]">
                    {selectedRowData?.refNo}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-white" />
                <div className="">
                  <p className="lg:text-sm text-[10px] font-normal">
                    Tender ID.
                  </p>
                  <h2 className="lg:text-sm text-[10px]">
                    {selectedRowData?.TenderId}
                  </h2>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="py-6 text-center font-medium text-xs lg:text-lg">
                {selectedRowData?.tenderName}
              </h3>
              <p className="text-sm text-center flex items-center justify-center">
                <Collapsible
                  open={desOpen}
                  onOpenChange={setDesOpen}
                  className="flex flex-col items-center justify-center"
                >
                  <CollapsibleTrigger className="duration-300 text-black m-auto w-fit">
                    <div className="bg-white flex items-center gap-0 pl-2 rounded-lg">
                      <span>Description</span>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronUp
                          className={`h-4 w-4 transform transition-transform duration-300
                ${desOpen ? "rotate-0" : "rotate-180"}`}
                        />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                    <div
                      className={`pt-2 pb-2 transition-all duration-300 ease-in-out
          ${
            desOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
                    >
                      {selectedRowData?.WorkDescription}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-4">
                  <Building size={20} color="white" />
                  <h4 className="lg:text-sm text-[10px]">
                    {selectedRowData?.department}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <Network size={20} color="white" />
                  <h4 className="lg:text-sm text-[10px]">
                    Sub Department <span>{selectedRowData?.subDepartment}</span>
                  </h4>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="flex gap-2 items-center">
                  <Database size={20} color="white" />
                  <h3 className="">Source:</h3>
                </div>
                <h4 className="lg:text-sm text-[10px] ">
                  {selectedRowData?.source}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex text-black justify-center items-center gap-2 py-2">
              <MapPin size={23} color="black" />
              <p className="lg:text-sm text-[10px]">
                {selectedRowData?.location}
              </p>
            </div>
            <div className="flex text-black justify-center items-center gap-2 py-2">
              <Image
                src="/district.png"
                width={28}
                height={26}
                alt="District"
              />
              <p className="lg:text-sm text-[10px]">
                {selectedRowData?.district}
              </p>
            </div>
          </div>
          <div className="flex text-black items-center justify-center py-2 w-full">
            <div className="lg:px-4 px-1 border-r w-full text-center py-1 lg:py-3 space-y-2">
              <p className="lg:text-xs text-[8px] font-medium">
                Published Date{" "}
              </p>
              <h1 className="font-semibold lg:text-sm text-[10px]">
                {formatDate(selectedRowData?.epublishedDate)}
              </h1>
            </div>
            <div className="lg:px-4 px-1 border-r text-center w-full py-1 lg:py-3 space-y-2">
              <p className="lg:text-xs text-[8px] font-medium">
                Bid Submission Date :{" "}
              </p>
              <h1 className="font-semibold lg:text-sm text-[10px]">
                {formatDate(selectedRowData?.bidSubmissionDate)}
              </h1>
            </div>
            <div className="lg:px-4 px-1 text-center w-full py-1 lg:py-3 space-y-2">
              <p className="lg:text-xs text-[8px] font-medium">
                Bid Opening Date :
              </p>
              <h1 className="font-semibold lg:text-sm text-[10px]">
                {formatDate(selectedRowData?.bidOpeningDate)}
              </h1>
            </div>
          </div>
          <div className="bg-[#EDEDED]  border-[#EDEDED] border flex items-center gap-4 justify-between px-1 lg:px-24 py-3 rounded-3xl w-full">
            <div className="flex text-black items-center justify-center w-full">
              <div className="lg:px-4 px-1 border-r border-gray-400 w-full text-center py-1 lg:py-3 space-y-2">
                <h1 className="text-[#4B4B4B] font-semibold text-xs lg:text-xl">
                  EMD Amount
                </h1>
                <h3 className="text-[#2E2E2E] font-medium text-xs lg:text-base">
                  {formatIndianRupeePrice(selectedRowData?.EMDAmountin)}
                </h3>
              </div>
              <div className="lg:px-4 px-1 w-full text-center py-1 lg:py-3 space-y-2">
                <h1 className="text-[#4B4B4B] font-semibold text-xs lg:text-xl">
                  Tender Value
                </h1>
                <h3 className="text-[#2E2E2E] font-medium text-xs lg:text-base">
                  {formatIndianRupeePrice(selectedRowData?.tenderValue)}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center pt-2 items-center w-full">
            <Button
              onClick={() => handleToSendTender(selectedRowData)}
              disabled={setButtonStatus(selectedRowData?.bidSubmissionDate)}
            >
              Request For Documents
            </Button>
            {setButtonStatus(selectedRowData?.bidSubmissionDate) && (
              <p className="text-orange-600 text-xs font-bold">
                *Submission Time Expired
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenderDetailsDialog;
