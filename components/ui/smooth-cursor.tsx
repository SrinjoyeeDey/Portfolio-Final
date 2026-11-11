"use client"

import { useEffect, useId, useRef, useState, type FC, type ReactNode } from "react"
import { motion, useReducedMotion, useSpring } from "motion/react"

interface Position {
  x: number
  y: number
}

export interface SmoothCursorProps {
  cursor?: ReactNode
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
    restDelta: number
  }
  hideDefaultCursor?: boolean
  zIndex?: number
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)"

function isTrackablePointer(pointerType: string) {
  return pointerType !== "touch"
}

const DefaultCursorSVG: FC = () => {
  const filterId = `smooth-cursor-shadow-${useId().replace(/:/g, "")}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={24}
      viewBox="0 0 24 26"
      fill="none"
      style={{ display: "block" }}
    >
      <g filter={`url(#${filterId})`}>
        <path
          d="M4.2 2.8C3.55 2.42 2.78 2.98 2.96 3.72L6.98 20.6C7.17 21.4 8.21 21.58 8.66 20.9L12.05 15.72C12.22 15.46 12.48 15.27 12.78 15.18L18.88 13.4C19.68 13.17 19.79 12.08 19.06 11.66L4.2 2.8Z"
          fill="#222428"
          stroke="#FFFFFF"
          strokeWidth={1.85}
          strokeLinejoin="round"
        />
        <circle cx="9.2" cy="10.4" r="1.35" fill="#FFBD12" />
      </g>
      <defs>
        <filter
          id={filterId}
          x={0}
          y={0}
          width={24}
          height={26}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1.5} />
          <feGaussianBlur stdDeviation={1.4} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.08 0 0 0 0 0.09 0 0 0 0 0.11 0 0 0 0.24 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 52,
    stiffness: 1200,
    mass: 0.25,
    restDelta: 0.001,
  },
  hideDefaultCursor = true,
  zIndex = 100,
}: SmoothCursorProps) {
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef(Date.now())
  const hasPositioned = useRef(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    damping: 26,
    stiffness: 340,
    mass: 0.45,
  })
  const scale = useSpring(1, {
    stiffness: 600,
    damping: 32,
    mass: 0.3,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY)

    const updateEnabled = () => {
      const nextIsEnabled = mediaQuery.matches
      setIsEnabled(nextIsEnabled)

      if (!nextIsEnabled) {
        hasPositioned.current = false
        setIsVisible(false)
      }
    }

    updateEnabled()
    mediaQuery.addEventListener("change", updateEnabled)

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    if (prefersReducedMotion) {
      rotation.jump(0)
      scale.jump(1)
    }

    let settleTimeout: ReturnType<typeof setTimeout> | null = null
    let pressed = false

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      const currentPos = { x: e.clientX, y: e.clientY }

      if (!hasPositioned.current) {
        hasPositioned.current = true
        lastMousePos.current = currentPos
        lastUpdateTime.current = Date.now()
        cursorX.jump(currentPos.x)
        cursorY.jump(currentPos.y)
        rotation.jump(0)
        setIsVisible(true)
        return
      }

      setIsVisible(true)

      if (prefersReducedMotion) {
        cursorX.jump(currentPos.x)
        cursorY.jump(currentPos.y)
        lastMousePos.current = currentPos
        return
      }

      const currentTime = Date.now()
      const deltaTime = Math.max(4, currentTime - lastUpdateTime.current)
      const vx = (currentPos.x - lastMousePos.current.x) / deltaTime
      const vy = (currentPos.y - lastMousePos.current.y) / deltaTime
      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      // Subtle natural banking tilt (+/-14deg max) instead of 360-degree flipping
      const speed = Math.hypot(vx, vy)
      if (speed > 0.08) {
        const tilt = Math.max(-14, Math.min(14, vx * 7.5 + vy * 1.5))
        rotation.set(tilt)
        if (!pressed) {
          scale.set(0.95)
        }
      }

      if (settleTimeout !== null) {
        clearTimeout(settleTimeout)
      }

      settleTimeout = setTimeout(() => {
        rotation.set(0)
        if (!pressed) {
          scale.set(1)
        }
      }, 95)
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) return
      pressed = true
      if (!prefersReducedMotion) {
        scale.set(0.84)
      }
    }

    const handlePointerUp = () => {
      pressed = false
      if (!prefersReducedMotion) {
        scale.set(1)
      }
    }

    const handleLeave = () => {
      pressed = false
      hasPositioned.current = false
      rotation.set(0)
      scale.set(1)
      setIsVisible(false)
    }

    if (hideDefaultCursor) {
      document.body.style.cursor = "none"
    }

    window.addEventListener("pointermove", smoothPointerMove, {
      passive: true,
    })
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    })
    window.addEventListener("pointerup", handlePointerUp, {
      passive: true,
    })
    document.documentElement.addEventListener("pointerleave", handleLeave)
    window.addEventListener("blur", handleLeave)

    return () => {
      window.removeEventListener("pointermove", smoothPointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      document.documentElement.removeEventListener("pointerleave", handleLeave)
      window.removeEventListener("blur", handleLeave)
      if (hideDefaultCursor) {
        document.body.style.cursor = "auto"
      }
      if (settleTimeout !== null) {
        clearTimeout(settleTimeout)
      }
    }
  }, [cursorX, cursorY, rotation, scale, isEnabled, hideDefaultCursor, prefersReducedMotion])

  if (!isEnabled) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="smooth-cursor-root"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        zIndex,
        pointerEvents: "none",
        willChange: "transform",
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.12,
      }}
    >
      <motion.div
        style={{
          translateX: "-15%",
          translateY: "-12%",
          rotate: rotation,
          scale: scale,
          transformOrigin: "3px 3px",
          willChange: "transform",
        }}
      >
        {cursor}
      </motion.div>
    </motion.div>
  )
}
