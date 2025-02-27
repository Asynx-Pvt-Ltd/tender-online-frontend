"use client";
import React, { useEffect, useState } from "react";
import TenderHeader from "@/components/shared/tender-header";
import { useQuery } from "@tanstack/react-query";
import { DataTableTender } from "@/components/table/tender-table";
import AdsImage from "@/components/shared/ads-image";
import Footer from "@/components/shared/footer";
import Loading from "@/components/ui/loading";
import InactiveUserMessage from "@/components/shared/inActiveUser";
import FreeTrialComplete from "@/components/shared/freeTrailComplete";

export default function Page() {
  const [search, setSearch] = useState("");
  const [tenderLength, setTenderLength] = useState(null);

  const { data: userStatus, isLoading } = useQuery({
    queryKey: ["userStatus"],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENPOINT + "/api/auth/status",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.json();
    },
  });

  const [isMobile, setIsMobile] = useState<any>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  const renderContent = () => {
    if (userStatus?.status === "inactive") {
      return <InactiveUserMessage />;
    } else if (!userStatus?.isTendersVisible) {
      return <FreeTrialComplete />;
    } else {
      return (
        <DataTableTender
          setSearch={setSearch}
          search={search}
          setTenderLength={setTenderLength}
        />
      );
    }
  };

  return (
    <main className="w-full bg-white">
      <TenderHeader tenderLength={tenderLength} />
      <div className="w-full px-4">
        {renderContent()}
        <AdsImage />
      </div>
      <Footer />
    </main>
  );
}
