import { useEffect, MutableRefObject, useRef } from "react";
export function useOutsideAlerter(elementRef: MutableRefObject<any>, callback: (ev: MouseEvent) => void) {
    const savedCallback = useRef<((ev: MouseEvent) => void) | null>(null);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    function handleClickOutside(event: MouseEvent) {
        if (elementRef.current && !elementRef.current.contains(event.target)) {
            savedCallback.current && savedCallback.current(event);
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, { capture: true });
        return () => {
            document.removeEventListener("click", handleClickOutside, { capture: true });
        };
    });
}
