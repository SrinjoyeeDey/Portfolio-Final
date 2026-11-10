"use client"

import type React from "react"
import { useState } from "react"
import { ArrowUpRight, Calendar } from "lucide-react"

export function LetsWorkTogether({ 
  className,
  compact = false,
  showTitle = false
}: { 
  className?: string
  compact?: boolean
  showTitle?: boolean
} = {}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    e.preventDefault()
    if (typeof window !== "undefined" && (window as any).PortoSound?.playClick) {
      (window as any).PortoSound.playClick(true)
    }
    setIsClicked(true)

    setTimeout(() => {
      setShowSuccess(true)
      if (typeof window !== "undefined" && (window as any).PortoSound?.playSuccess) {
        (window as any).PortoSound.playSuccess()
      }
    }, 500)
  }

  const handleBookCall = () => {
    if (typeof window !== "undefined" && (window as any).PortoSound?.playClick) {
      (window as any).PortoSound.playClick(true)
    }
    window.open("mailto:deysrinjoyee28@gmail.com", "_blank")
  }

  return (
    <section className={`flex items-center justify-center px-6 ${className !== undefined ? className : "min-h-screen"}`}>
      <div className={`relative flex flex-col items-center ${compact ? "gap-4 sm:gap-6" : "gap-12"} w-full max-w-4xl`}>
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: showSuccess ? 1 : 0,
            transform: showSuccess ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            pointerEvents: showSuccess ? "auto" : "none",
          }}
        >
          {/* Elegant heading */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span
              className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-all duration-500"
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "100ms",
              }}
            >
              Perfect
            </span>
            <h3
              className={`${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-light tracking-tight text-foreground transition-all duration-500`}
              style={{
                transform: showSuccess ? "translateY(0)" : "translateY(10px)",
                opacity: showSuccess ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              Let's talk
            </h3>
          </div>

          {/* Book a call button */}
          <button
            onClick={handleBookCall}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="group relative flex items-center gap-3 sm:gap-4 transition-all duration-500 cursor-pointer bg-transparent border-0"
            style={{
              transform: showSuccess
                ? isButtonHovered
                  ? "translateY(0) scale(1.02)"
                  : "translateY(0) scale(1)"
                : "translateY(15px) scale(1)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "150ms",
            }}
          >
            {/* Left line */}
            <div
              className="h-px w-6 sm:w-12 bg-border transition-all duration-500"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />

            {/* Button content */}
            <div
              className={`relative flex items-center gap-2 sm:gap-3 overflow-hidden rounded-full border ${compact ? "px-5 py-2.5 sm:px-6 sm:py-3" : "px-6 py-3 sm:px-8 sm:py-4"} transition-all duration-500`}
              style={{
                borderColor: isButtonHovered ? "var(--foreground)" : "var(--border)",
                backgroundColor: isButtonHovered ? "var(--foreground)" : "transparent",
                boxShadow: isButtonHovered ? "0 0 30px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Calendar
                className="size-4 transition-all duration-500 sm:size-5"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                }}
              />
              <span
                className="text-xs sm:text-sm font-medium tracking-wide transition-all duration-500"
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                }}
              >
                Book a call
              </span>
              <ArrowUpRight
                className="size-3.5 sm:size-4 transition-all duration-500"
                strokeWidth={1.5}
                style={{
                  color: isButtonHovered ? "var(--background)" : "var(--foreground)",
                  transform: isButtonHovered ? "translate(3px, -3px) scale(1.1)" : "translate(0, 0) scale(1)",
                }}
              />
            </div>

            {/* Right line */}
            <div
              className="h-px w-6 sm:w-12 bg-border transition-all duration-500"
              style={{
                transform: isButtonHovered ? "scaleX(0)" : "scaleX(1)",
                opacity: isButtonHovered ? 0 : 0.5,
              }}
            />
          </button>

          {/* Subtle subtext */}
          <span
            className="text-[11px] sm:text-xs tracking-widest uppercase text-muted-foreground/50 transition-all duration-500"
            style={{
              transform: showSuccess ? "translateY(0)" : "translateY(10px)",
              opacity: showSuccess ? 1 : 0,
              transitionDelay: "450ms",
            }}
          >
            15 min intro call
          </span>
        </div>

        <div
          className="flex items-center gap-2 sm:gap-3 transition-all duration-500"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(-20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-muted-foreground">
            Available for projects
          </span>
        </div>

        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>)}
          style={{
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <div className={`flex flex-col items-center ${compact ? "gap-3 sm:gap-4" : "gap-6"}`}>
            {showTitle && (
              <h2
                className={`relative text-center ${compact ? "text-3xl sm:text-4xl md:text-5xl" : "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"} font-light tracking-tight text-foreground transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                style={{
                  opacity: isClicked ? 0 : 1,
                  transform: isClicked ? "translateY(-40px) scale(0.95)" : "translateY(0) scale(1)",
                }}
              >
                <span className="block overflow-hidden">
                  <span
                    className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                    }}
                  >
                    Let's work
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                    style={{
                      transform: isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                    }}
                  >
                    <span className="text-muted-foreground/60">together</span>
                  </span>
                </span>
              </h2>
            )}

            <div className={`relative ${compact ? "size-12 sm:size-14" : "mt-4 size-16 sm:size-20"} flex items-center justify-center`}>
              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out"
                style={{
                  borderColor: isClicked ? "var(--foreground)" : isHovered ? "var(--foreground)" : "var(--border)",
                  backgroundColor: isClicked ? "transparent" : isHovered ? "var(--foreground)" : "transparent",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.1)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <ArrowUpRight
                className={`${compact ? "size-5 sm:size-6" : "size-6 sm:size-7"} transition-all ease-[cubic-bezier(0.16,1,0.3,1)]`}
                style={{
                  transform: isClicked
                    ? "translate(100px, -100px) scale(0.5)"
                    : isHovered
                      ? "translate(2px, -2px)"
                      : "translate(0, 0)",
                  opacity: isClicked ? 0 : 1,
                  color: isHovered && !isClicked ? "var(--background)" : "var(--foreground)",
                  transitionDuration: isClicked ? "600ms" : "500ms",
                }}
              />
            </div>
          </div>

          <div className="absolute -left-6 top-1/2 -translate-y-1/2 sm:-left-12">
            <div
              className="h-px w-6 bg-border transition-all duration-500 sm:w-10"
              style={{
                transform: isClicked ? "scaleX(0) translateX(-20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 sm:-right-12">
            <div
              className="h-px w-6 bg-border transition-all duration-500 sm:w-10"
              style={{
                transform: isClicked ? "scaleX(0) translateX(20px)" : isHovered ? "scaleX(1.5)" : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.5,
              }}
            />
          </div>
        </div>

        <div
          className={`${compact ? "mt-2 sm:mt-3" : "mt-8"} flex flex-col items-center gap-2 sm:gap-3 text-center transition-all duration-500 delay-100`}
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(20px)" : "translateY(0)",
            pointerEvents: isClicked ? "none" : "auto",
          }}
        >
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Have a project in mind? I'd love to hear about it. Let's create something exceptional together.
          </p>
          <span className="text-[11px] sm:text-xs tracking-widest uppercase text-muted-foreground/60">deysrinjoyee28@gmail.com</span>
        </div>
      </div>
    </section>
  )
}
