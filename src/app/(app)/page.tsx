'use client'
import { useRef } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
  // Create ref for Embla Carousel with Autoplay
  const autoplayRef = useRef(Autoplay({ delay: 2000 }))
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplayRef.current])

  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12 '>
        <h1 className='text-3xl md:text-5xl font-bold ' >Dive into the World of Anonymous Conversation</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where your identity remains a secret.</p>
      </section>
      <div className="w-full max-w-xs" ref={emblaRef}>
        <Carousel >
          <CarouselContent className='bg-gray-200 w-vw' >
            {messages.map((message,index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className='bg-violet-300 '>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
    <footer className="text-center mt-8 py-4 text-sm">
        © 2023 Mystery Message. All rights reserved.
      </footer>
    </>
  )
}

export default Home
