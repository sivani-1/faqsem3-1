// import React from "react";
// import SwiperCore, { Navigation, Pagination } from "swiper";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "./CarouselSection.css";

// SwiperCore.use([Navigation, Pagination]);

// function CarouselSection() {
//   return (
//     <section className="carousel-section">
//       <Swiper navigation pagination={{ clickable: true }}>
//         <SwiperSlide>
//           <img src="https://source.unsplash.com/800x600/?graduation" alt="Event 1" />
//         </SwiperSlide>
//         <SwiperSlide>
//           <img src="https://source.unsplash.com/800x600/?campus" alt="Event 2" />
//         </SwiperSlide>
//       </Swiper>
//     </section>
//   );
// }

// export default CarouselSection;


import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./CarouselSection.css";

function CarouselSection() {
  return (
    <section className="carousel-section">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
      >
        <SwiperSlide>
          <img src="https://source.unsplash.com/800x600/?graduation" alt="Event 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://source.unsplash.com/800x600/?campus" alt="Event 2" />
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default CarouselSection;
