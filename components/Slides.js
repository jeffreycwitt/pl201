import {Fragment, useState, useEffect, useRef} from "react"

// Load YouTube's IFrame Player API once; resolves with window.YT.
let youTubeApi
function loadYouTubeApi() {
  if (!youTubeApi) {
    youTubeApi = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve(window.YT)
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous && previous()
        resolve(window.YT)
      }
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(script)
    })
  }
  return youTubeApi
}

// YouTube's replay button ignores the embed's start time and jumps to 0:00.
// For embeds with enablejsapi=1, re-cue the clip at its start/end times when
// it finishes, so pressing play runs the same segment again.
function attachClipReplay(YT, iframe) {
  if (iframe.dataset.clipReplay) return
  iframe.dataset.clipReplay = "true"
  const url = new URL(iframe.src)
  const videoId = url.pathname.split('/').pop()
  const startSeconds = Number(url.searchParams.get('start')) || 0
  const endSeconds = Number(url.searchParams.get('end')) || undefined
  new YT.Player(iframe, {
    events: {
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          event.target.cueVideoById({videoId, startSeconds, endSeconds})
        }
      },
    },
  })
}

export default function Slides(props) {
  const [slideNumber, setSlideNumber] = useState(0)
  const containerRef = useRef(null)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        setSlideNumber((prevSlideNumber) => 
          Math.min(prevSlideNumber + 1, props.children.length - 1)
        );
      } else if (event.key === 'ArrowUp') {
        setSlideNumber((prevSlideNumber) => 
          Math.max(prevSlideNumber - 1, 0)
        );
      }
    };

    // Clicking into an embedded iframe (e.g. a YouTube video) moves keyboard
    // focus into it, so keydown events stop reaching this window. Pull focus
    // back to the page so the arrow keys keep changing slides.
    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
          // Focus a real element in this document; window.focus() alone
          // doesn't take focus back from a cross-origin iframe.
          containerRef.current && containerRef.current.focus({preventScroll: true});
        }
      }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
    };
  }, [props.children.length]);

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    const attachAll = () => {
      const iframes = container.querySelectorAll('iframe[src*="youtube.com/embed/"][src*="enablejsapi=1"]')
      if (iframes.length === 0) return
      loadYouTubeApi().then((YT) => {
        if (!cancelled) iframes.forEach((iframe) => attachClipReplay(YT, iframe))
      })
    }
    // Slide content is loaded dynamically, so the iframe may appear after this runs.
    attachAll()
    const observer = new MutationObserver(attachAll)
    observer.observe(container, {childList: true, subtree: true})
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [slideNumber]);

  return (
    <div className="slides" ref={containerRef} tabIndex={-1} style={{outline: "none"}}>
      {/* key forces a fresh mount per slide, so per-slide state (e.g. a playing video) resets */}
      <Fragment key={slideNumber}>{props.children[slideNumber]}</Fragment>
      {/* <style jsx>{`
        .slide { width: 80%; height: 98vh; align-items: center; justify-content: center; font-size: 1.75em; border-bottom: .5px dotted black; padding: 0 10% }
      `}</style> */}
    </div>
  )
}