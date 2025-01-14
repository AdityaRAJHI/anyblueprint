'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { BarChart3, Headphones, PiggyBank, Book, Plane, Camera, Utensils, Dumbbell, TreesIcon as Plant, Palette, Film, Zap, Briefcase, Gamepad2, ShoppingBag, Microscope, Globe, Cpu } from 'lucide-react'

interface Prompt {
  id: string
  icon: React.ReactNode
  text: string
}

const topRowPrompts: Prompt[] = [
  { id: '1', icon: <BarChart3 className="w-4 h-4" />, text: "Spotify listening analytics" },
  { id: '2', icon: <PiggyBank className="w-4 h-4" />, text: "Personal finances tracker" },
  { id: '3', icon: <Book className="w-4 h-4" />, text: "Digital scrapbooking app" },
  { id: '4', icon: <Headphones className="w-4 h-4" />, text: "Music genre explorer" },
  { id: '5', icon: <Plane className="w-4 h-4" />, text: "Travel itinerary planner" },
  { id: '6', icon: <Camera className="w-4 h-4" />, text: "AI image enhancement tool" },
  { id: '7', icon: <Utensils className="w-4 h-4" />, text: "Recipe sharing social network" },
  { id: '8', icon: <Dumbbell className="w-4 h-4" />, text: "Personalized workout generator" },
  { id: '9', icon: <Plant className="w-4 h-4" />, text: "Smart garden monitoring system" },
]

const bottomRowPrompts: Prompt[] = [
  { id: '10', icon: <Palette className="w-4 h-4" />, text: "Collaborative digital whiteboard" },
  { id: '11', icon: <Film className="w-4 h-4" />, text: "Movie recommendation engine" },
  { id: '12', icon: <Zap className="w-4 h-4" />, text: "Home energy consumption tracker" },
  { id: '13', icon: <Briefcase className="w-4 h-4" />, text: "Freelance project management tool" },
  { id: '14', icon: <Gamepad2 className="w-4 h-4" />, text: "Video game emulator" },
  { id: '15', icon: <ShoppingBag className="w-4 h-4" />, text: "Sustainable fashion marketplace" },
  { id: '16', icon: <Microscope className="w-4 h-4" />, text: "Citizen science data collection app" },
  { id: '17', icon: <Globe className="w-4 h-4" />, text: "Language exchange platform" },
  { id: '18', icon: <Cpu className="w-4 h-4" />, text: "IoT device management dashboard" },
]

interface PromptCarouselProps {
  onPromptSelect: (prompt: string) => void
}

export default function PromptCarousel({ onPromptSelect }: PromptCarouselProps) {
  const [topRowOffset, setTopRowOffset] = useState(0)
  const [bottomRowOffset, setBottomRowOffset] = useState(0)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)
  const [isTopRowPaused, setIsTopRowPaused] = useState(false)
  const [isBottomRowPaused, setIsBottomRowPaused] = useState(false)

  useEffect(() => {
    let animationFrameId: number
    let lastTimestamp = 0

    const animate = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp
      }

      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      if (!isTopRowPaused && topRowRef.current) {
        setTopRowOffset((prevOffset) => {
          const newOffset = (prevOffset + 0.02 * deltaTime) % (topRowRef.current!.scrollWidth / 2)
          return newOffset
        })
      }
      if (!isBottomRowPaused && bottomRowRef.current) {
        setBottomRowOffset((prevOffset) => {
          const newOffset = (prevOffset - 0.02 * deltaTime + bottomRowRef.current!.scrollWidth / 2) % (bottomRowRef.current!.scrollWidth / 2)
          return newOffset
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isTopRowPaused, isBottomRowPaused])

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt)
  }

  return (
    <div className="relative w-full overflow-hidden py-4 mb-6 rounded-md ">
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden">
          <div 
            ref={topRowRef} 
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${topRowOffset}px)` }}
            onMouseEnter={() => setIsTopRowPaused(true)}
            onMouseLeave={() => setIsTopRowPaused(false)}
          >
            {[...topRowPrompts, ...topRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt.text)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            ref={bottomRowRef}
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${bottomRowOffset}px)` }}
            onMouseEnter={() => setIsBottomRowPaused(true)}
            onMouseLeave={() => setIsBottomRowPaused(false)}
          >
            {[...bottomRowPrompts, ...bottomRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt.text)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#1e3a8a] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#1e3a8a] to-transparent pointer-events-none" />
    </div>
  )
}
