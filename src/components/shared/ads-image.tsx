import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";

interface Ad {
  imageUrl: string;
  url: string;
}

const AdsImage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [api]);

  const { data: ads } = useQuery<Ad[]>({
    queryKey: ["Ads"],
    queryFn: () =>
      fetch(process.env.NEXT_PUBLIC_API_ENPOINT + `/api/ads/images`).then(
        (res) => res.json()
      ),
  });

  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    return null;
  }

  return (
    <div className="pt-6 px-4 lg:px-4 pb-8">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
      >
        <CarouselContent>
          {ads.map((ad: Ad, index: number) => (
            <CarouselItem key={index} className="lg:basis-1/2 basis-full">
              <Link
                target="_blank"
                href={ad.url || "/"}
                className="lg:h-64 h-28 w-full"
              >
                <img
                  src={ad.imageUrl}
                  alt="Advertisement"
                  className="lg:h-52 h-28 object-cover w-full rounded-xl"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext className="mr-14" />
      </Carousel>
    </div>
  );
};

export default AdsImage;
