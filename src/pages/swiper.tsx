// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



export default function HomePage(){
    return (
    <Swiper
       modules={[Navigation, Pagination]}
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide><div className='w-72 h-40 bg-red-200 text-red-500'>SLIDE 01</div></SwiperSlide>
      <SwiperSlide><div className='w-72 h-40 bg-lime-200 text-lime-500'>SLIDE 02</div></SwiperSlide>
      <SwiperSlide><div className='w-72 h-40 bg-purple-200 text-purple-500'>SLIDE 03</div></SwiperSlide>
      <SwiperSlide><div className='w-72 h-40 bg-orange-200 text-orange-500'>SLIDE 04</div></SwiperSlide>
    </Swiper>
    )
}