// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/config/axios-config';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export type TBanner = {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

async function fetchAxios(url: string): Promise<TBanner[]> {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  const response = await api.get(url);

  return response.data;
}



export default function HomePage(){
  const {data, isLoading, isError} = useQuery({
    queryKey: ["listBanners"],
    queryFn: () => fetchAxios("/bannners"),
    gcTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  if(isLoading){
    return (
      <div className="w-full h-[500px] flex justify-center items-center text-center"><DotLottieReact
      src="/loader.json"
      loop
      autoplay
    /></div>
    )
  }

  if(isError){
    return (
      <div className="w-full h-[500px] flex justify-center items-center text-center"><DotLottieReact
      src="/coffee.json"
      loop
      autoplay
    /></div>
    )
  }


      return (
        <div className="w-full max-w-full overflow-hidden mt-20">
        <div className="w-full max-w-[1200px] mx-auto px-5 box-border">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={3}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true
            }}
            className="w-full"
            style={{ 
              '--swiper-navigation-color': '#000',
              '--swiper-pagination-color': '#000',
            } as React.CSSProperties}
          >
            {data?.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="w-full h-[300px] bg-red-100 rounded-lg overflow-hidden">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper><div className="flex justify-between items-center mt-8">
            <div className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
            
            {/* Paginação customizada */}
            <div className="swiper-pagination-custom flex gap-2 justify-center"></div>
            
            <div className="swiper-button-next-custom w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      )
    
}