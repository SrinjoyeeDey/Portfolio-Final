"use client"

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react"
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

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

const DefaultCursorSVG: FC = () => {
  const rawId = useId()
  const filterId = `smooth-cursor-shadow-${rawId.replace(/:/g, "")}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={27}
      viewBox="0 0 50 54"
      fill="none"
      style={{ display: "block" }}
    >
      <g filter={`url(#${filterId})`}>
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="white"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
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
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"
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
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
  hideDefaultCursor = true,
  zIndex = 2147483647,
}: SmoothCursorProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMoving = useRef<boolean>(false)
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef<number>(Date.now())
  const previousAngle = useRef<number>(0)
  const accumulatedRotation = useRef<number>(0)
  const hasPositioned = useRef<boolean>(false)
  const prefersReducedMotion = useReducedMotion()

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    damping: 60,
    stiffness: 300,
  })
  const scale = useSpring(1, {
    stiffness: 500,
    damping: 35,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY)

    const syncPointerCapability = () => {
      const fine = mediaQuery.matches
      setIsEnabled(fine)
      if (!fine) {
        hasPositioned.current = false
        setIsVisible(false)
      }
    }

    syncPointerCapability()
    mediaQuery.addEventListener("change", syncPointerCapability)

    return () => {
      mediaQuery.removeEventListener("change", syncPointerCapability)
    }
  }, [])

  useEffect(() => {
    const rootEl = document.documentElement
    if (isEnabled && hideDefaultCursor) {
      rootEl.classList.add("smooth-cursor-active")
    } else {
      rootEl.classList.remove("smooth-cursor-active")
    }

    return () => {
      rootEl.classList.remove("smooth-cursor-active")
    }
  }, [isEnabled, hideDefaultCursor])

  useEffect(() => {
    if (!isEnabled) return

    if (prefersReducedMotion) {
      rotation.jump(0)
      scale.jump(1)
    }

    let rafId: number | null = null
    let settleTimeout: ReturnType<typeof setTimeout> | null = null
    let latestPos: Position = { x: 0, y: 0 }
    let isPressed = false

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now()
      const deltaTime = Math.max(4, currentTime - lastUpdateTime.current)

      velocity.current = {
        x: (currentPos.x - lastMousePos.current.x) / deltaTime,
        y: (currentPos.y - lastMousePos.current.y) / deltaTime,
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const applyPointerPosition = (currentPos: Position) => {
      if (!hasPositioned.current) {
        hasPositioned.current = true
        lastMousePos.current = currentPos
        lastUpdateTime.current = Date.now()
        cursorX.jump(currentPos.x)
        cursorY.jump(currentPos.y)
        rotation.jump(0)
        scale.jump(1)
        previousAngle.current = 0
        accumulatedRotation.current = 0
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

      updateVelocity(currentPos)

      const speed = Math.hypot(velocity.current.x, velocity.current.y)

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        if (!isPressed) {
          scale.set(0.95)
        }
        isMoving.current = true

        if (settleTimeout !== null) {
          clearTimeout(settleTimeout)
        }
        settleTimeout = setTimeout(() => {
          isMoving.current = false
          if (!isPressed) {
            scale.set(1)
          }
        }, 150)
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        hasPositioned.current = false
        setIsVisible(false)
        document.documentElement.classList.remove("smooth-cursor-active")
        return
      }

      if (hideDefaultCursor) {
        document.documentElement.classList.add("smooth-cursor-active")
      }

      latestPos = { x: e.clientX, y: e.clientY }
      if (!hasPositioned.current) {
        applyPointerPosition(latestPos)
        return
      }

      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        applyPointerPosition(latestPos)
        rafId = null
      })
    }

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      isPressed = true
      if (!prefersReducedMotion) {
        scale.set(0.85)
      }
    }

    const handlePointerUp = () => {
      isPressed = false
      if (!prefersReducedMotion) {
        scale.set(isMoving.current ? 0.95 : 1)
      }
    }

    const handleLeave = () => {
      isPressed = false
      isMoving.current = false
      hasPositioned.current = false
      setIsVisible(false)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    document.documentElement.addEventListener("mouseleave", handleLeave)
    window.addEventListener("blur", handleLeave)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      document.documentElement.removeEventListener("mouseleave", handleLeave)
      window.removeEventListener("blur", handleLeave)
      if (rafId !== null) cancelAnimationFrame(rafId)
      if (settleTimeout !== null) clearTimeout(settleTimeout)
    }
  }, [
    cursorX,
    cursorY,
    rotation,
    scale,
    isEnabled,
    hideDefaultCursor,
    prefersReducedMotion,
  ])

  if (!isEnabled) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="smooth-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex,
        pointerEvents: "none",
        willChange: "transform, opacity",
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.12 }}
    >
      {cursor}
    </motion.div>
  )
}

export default SmoothCursor
