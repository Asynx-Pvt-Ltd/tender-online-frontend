import { useReactTable } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDate, formatIndianRupeePrice } from "../table/tender-columns";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, ChevronUp, X } from "lucide-react";
import React, { useEffect } from "react";
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
    // const url =
    //   process.env.NEXT_PUBLIC_API_ENPOINT + "/api/tender/tender-mapping"; // Adjust the URL as needed

    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    //     },
    //     body: JSON.stringify({ tenderId }),
    //   });

    //   if (response.ok) {
    //     toast.success(
    //       "Tender documents request sended successfully. we will reach out soon to you."
    //     );
    //     setSelectedRowData(null);
    //   } else {
    //     const data = await response.json();
    //     console.log(data);
    //     toast.error("Some error occurred");
    //   }
    // } catch (error) {}

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
      <DialogContent className="max-w-[90%] lg:h-full rounded-xl lg:max-w-3xl lg:rounded-3xl text-white bg-white">
        <button
          onClick={() => setSelectedRowData(null)}
          className="outline-none"
        >
          <X color="black" />
        </button>
        <div className="lg:px-4 px-0">
          <div className="bg-[#000000] rounded-xl lg:rounded-3xl px-2 lg:px-4 lg:py-2 py-6">
            <div className="flex lg:flex-row flex-wrap items-center justify-between w-full">
              <div className="flex  items-center gap-2">
                <div className="">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9718 3.02812C14.3093 1.36563 11.6078 1.36563 9.94527 3.02812L7.78402 5.18937C7.55246 5.42094 7.55246 5.795 7.78402 6.02656C8.01559 6.25812 8.38965 6.25812 8.62121 6.02656L10.7825 3.86531C11.9818 2.66594 13.9293 2.66594 15.1287 3.86531C15.7106 4.44719 16.0312 5.21906 16.0253 6.04437C16.0253 6.86375 15.7106 7.63562 15.1287 8.2175L12.9675 10.3787C12.7359 10.6103 12.7359 10.9844 12.9675 11.2159C13.0862 11.3347 13.2346 11.3881 13.389 11.3881C13.5434 11.3881 13.6918 11.3287 13.8106 11.2159L15.9718 9.05469C16.7793 8.24719 17.2246 7.1725 17.2187 6.04437C17.2187 4.91031 16.7793 3.83562 15.9718 3.02812Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M10.3787 12.9735L8.21748 15.1347C7.01811 16.3341 5.07061 16.3341 3.87123 15.1347C3.28936 14.5528 2.96873 13.781 2.97467 12.9556C2.97467 12.1363 3.28936 11.3644 3.87123 10.7825L6.03248 8.62127C6.26404 8.38971 6.26404 8.01565 6.03248 7.78408C5.80092 7.55252 5.42686 7.55252 5.19529 7.78408L3.03404 9.94533C2.22654 10.7528 1.78123 11.8275 1.78717 12.9556C1.78717 14.0897 2.22654 15.1644 3.03404 15.9719C3.84154 16.7794 4.95779 17.2188 6.05029 17.2188C7.14279 17.2188 8.23529 16.8031 9.06654 15.9719L11.2278 13.8106C11.4594 13.5791 11.4594 13.205 11.2278 12.9735C10.9962 12.7419 10.6222 12.7419 10.3906 12.9735H10.3787Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M11.6731 6.48373L6.48373 11.6731C6.25217 11.9047 6.25217 12.2787 6.48373 12.5103C6.60248 12.629 6.75092 12.6825 6.90529 12.6825C7.05967 12.6825 7.20811 12.6231 7.32686 12.5103L12.5162 7.32092C12.7478 7.08936 12.7478 6.71529 12.5162 6.48373C12.2847 6.25217 11.9106 6.25217 11.679 6.48373H11.6731Z"
                      fill="#D0D0D0"
                    />
                  </svg>
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
                <div className="">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.9718 3.02812C14.3093 1.36563 11.6078 1.36563 9.94527 3.02812L7.78402 5.18937C7.55246 5.42094 7.55246 5.795 7.78402 6.02656C8.01559 6.25812 8.38965 6.25812 8.62121 6.02656L10.7825 3.86531C11.9818 2.66594 13.9293 2.66594 15.1287 3.86531C15.7106 4.44719 16.0312 5.21906 16.0253 6.04437C16.0253 6.86375 15.7106 7.63562 15.1287 8.2175L12.9675 10.3787C12.7359 10.6103 12.7359 10.9844 12.9675 11.2159C13.0862 11.3347 13.2346 11.3881 13.389 11.3881C13.5434 11.3881 13.6918 11.3287 13.8106 11.2159L15.9718 9.05469C16.7793 8.24719 17.2246 7.1725 17.2187 6.04437C17.2187 4.91031 16.7793 3.83562 15.9718 3.02812Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M10.3787 12.9735L8.21748 15.1347C7.01811 16.3341 5.07061 16.3341 3.87123 15.1347C3.28936 14.5528 2.96873 13.781 2.97467 12.9556C2.97467 12.1363 3.28936 11.3644 3.87123 10.7825L6.03248 8.62127C6.26404 8.38971 6.26404 8.01565 6.03248 7.78408C5.80092 7.55252 5.42686 7.55252 5.19529 7.78408L3.03404 9.94533C2.22654 10.7528 1.78123 11.8275 1.78717 12.9556C1.78717 14.0897 2.22654 15.1644 3.03404 15.9719C3.84154 16.7794 4.95779 17.2188 6.05029 17.2188C7.14279 17.2188 8.23529 16.8031 9.06654 15.9719L11.2278 13.8106C11.4594 13.5791 11.4594 13.205 11.2278 12.9735C10.9962 12.7419 10.6222 12.7419 10.3906 12.9735H10.3787Z"
                      fill="#D0D0D0"
                    />
                    <path
                      d="M11.6731 6.48373L6.48373 11.6731C6.25217 11.9047 6.25217 12.2787 6.48373 12.5103C6.60248 12.629 6.75092 12.6825 6.90529 12.6825C7.05967 12.6825 7.20811 12.6231 7.32686 12.5103L12.5162 7.32092C12.7478 7.08936 12.7478 6.71529 12.5162 6.48373C12.2847 6.25217 11.9106 6.25217 11.679 6.48373H11.6731Z"
                      fill="#D0D0D0"
                    />
                  </svg>
                </div>
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
            <div className="flex justify-between items-center">
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-4">
                  <Image
                    src={"/directorate.svg"}
                    alt="directorate"
                    width={25}
                    height={10}
                  />
                  <h4 className="lg:text-sm text-[10px]">
                    {selectedRowData?.department}
                  </h4>
                </div>
                <div className="flex items-center gap-4">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.55208 7.96458C6.35 7.62396 5.46875 6.51875 5.46875 5.20833C5.46875 3.62708 6.75208 2.34375 8.33333 2.34375C9.91458 2.34375 11.1979 3.62708 11.1979 5.20833C11.1979 6.51875 10.3167 7.62396 9.11458 7.96458V13.8708C9.40417 13.7229 9.72292 13.6219 10.0615 13.5802C11.451 13.4062 13.3552 13.1687 14.7448 12.9948C15.3969 12.9135 15.8854 12.3594 15.8854 11.7021V11.0896C14.6833 10.749 13.8021 9.64375 13.8021 8.33333C13.8021 6.75208 15.0854 5.46875 16.6667 5.46875C18.2479 5.46875 19.5312 6.75208 19.5312 8.33333C19.5312 9.64375 18.65 10.749 17.4479 11.0896V11.7021C17.4479 13.1469 16.3719 14.3656 14.9385 14.5448C13.549 14.7188 11.6448 14.9562 10.2552 15.1302C9.60313 15.2115 9.11458 15.7656 9.11458 16.4229V17.0354C10.3167 17.376 11.1979 18.4812 11.1979 19.7917C11.1979 21.3729 9.91458 22.6562 8.33333 22.6562C6.75208 22.6562 5.46875 21.3729 5.46875 19.7917C5.46875 18.4812 6.35 17.376 7.55208 17.0354V7.96458ZM8.33333 18.4896C9.05208 18.4896 9.63542 19.0729 9.63542 19.7917C9.63542 20.5104 9.05208 21.0938 8.33333 21.0938C7.61458 21.0938 7.03125 20.5104 7.03125 19.7917C7.03125 19.0729 7.61458 18.4896 8.33333 18.4896ZM16.6667 7.03125C17.3854 7.03125 17.9688 7.61458 17.9688 8.33333C17.9688 9.05208 17.3854 9.63542 16.6667 9.63542C15.9479 9.63542 15.3646 9.05208 15.3646 8.33333C15.3646 7.61458 15.9479 7.03125 16.6667 7.03125ZM8.33333 3.90625C9.05208 3.90625 9.63542 4.48958 9.63542 5.20833C9.63542 5.92708 9.05208 6.51042 8.33333 6.51042C7.61458 6.51042 7.03125 5.92708 7.03125 5.20833C7.03125 4.48958 7.61458 3.90625 8.33333 3.90625Z"
                      fill="#B9B9B9"
                    />
                  </svg>

                  <h4 className="lg:text-sm text-[10px]">
                    Sub Department <span>{selectedRowData?.subDepartment}</span>
                  </h4>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <div className="flex items-center">
                  <Image
                    src={"/globe.svg"}
                    width={20}
                    height={20}
                    alt="source"
                  />
                  <h3 className="">Source:</h3>
                </div>
                <h4 className="lg:text-sm text-[10px] ">
                  {selectedRowData?.source}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex text-black justify-center items-center gap-2 pt-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 0C6.32412 0 3.33337 2.99074 3.33337 6.66668C3.33337 7.7702 3.60927 8.86434 4.13376 9.8348L9.63548 19.7852C9.70873 19.9178 9.8483 20 10.0001 20C10.1518 20 10.2914 19.9178 10.3646 19.7852L15.8684 9.83152C16.3908 8.86434 16.6667 7.77016 16.6667 6.66664C16.6667 2.99074 13.676 0 10.0001 0ZM10.0001 10C8.16208 10 6.66673 8.50465 6.66673 6.66668C6.66673 4.82871 8.16208 3.33336 10.0001 3.33336C11.838 3.33336 13.3334 4.82871 13.3334 6.66668C13.3334 8.50465 11.838 10 10.0001 10Z"
                  fill="black"
                />
              </svg>
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
            <div className="flex text-black items-center justify-center py-2 w-full">
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
          <div className="flex flex-col justify-center pt-3 items-center w-full">
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
