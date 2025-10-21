import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCube, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-fade'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function ThemedCarousel({ 
  slides = [],
  effect = 'slide',
  autoplay = false,
  navigation = true,
  pagination = true,
  className = ''
}) {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay, EffectCube, EffectFade],
    spaceBetween: 30,
    slidesPerView: 1,
    effect,
    navigation: navigation,
    pagination: pagination ? { 
      clickable: true,
      dynamicBullets: true 
    } : false,
    autoplay: autoplay ? {
      delay: 3000,
      disableOnInteraction: false,
    } : false,
    speed: 600,
    loop: slides.length > 1,
  }

  if (effect === 'cube') {
    swiperConfig.cubeEffect = {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    }
  }

  const containerClasses = `
    ${className}
    ${theme.id === 'terminal' ? 'swiper-terminal' : 'swiper-glassmorphic'}
  `

  return (
    <div className={containerClasses}>
      <Swiper {...swiperConfig}>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`
              p-6 
              ${theme.colors.bg} 
              ${theme.rounded}
              border ${theme.colors.border}
              ${theme.effects.blur ? 'backdrop-blur-xl' : ''}
              min-h-[200px]
              flex items-center justify-center
            `}>
              {typeof slide === 'string' ? (
                <p className={`${theme.font} ${theme.colors.text} text-center`}>
                  {theme.id === 'terminal' ? `[${slide}]` : slide}
                </p>
              ) : (
                slide
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style>{`
        .swiper-terminal .swiper-button-next,
        .swiper-terminal .swiper-button-prev {
          color: #00ffff;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }
        
        .swiper-terminal .swiper-pagination-bullet {
          background: rgba(0, 255, 255, 0.3);
          border: 1px solid #00ffff;
        }
        
        .swiper-terminal .swiper-pagination-bullet-active {
          background: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }
        
        .swiper-glassmorphic .swiper-button-next,
        .swiper-glassmorphic .swiper-button-prev {
          color: #4cc3d9;
          filter: drop-shadow(0 4px 10px rgba(76, 195, 217, 0.5));
        }
        
        .swiper-glassmorphic .swiper-pagination-bullet {
          background: rgba(76, 195, 217, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .swiper-glassmorphic .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #4cc3d9, #7bc4ff);
          box-shadow: 0 4px 15px rgba(76, 195, 217, 0.6);
        }
      `}</style>
    </div>
  )
}
