import * as React from "react"
import { debounce } from "lodash"
import { BREAKPOINTS } from "@/lib/constants"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    window.innerWidth < BREAKPOINTS.MOBILE
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
    
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }, 100)

    // Initial check
    handleResize()
    
    // Add event listeners
    window.addEventListener("resize", handleResize)
    mql.addEventListener("change", handleResize)

    return () => {
      handleResize.cancel()
      window.removeEventListener("resize", handleResize)
      mql.removeEventListener("change", handleResize)
    }
  }, [])

  return isMobile
}
