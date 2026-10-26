import { useCallback, useState } from "react";

// status: "idle" | "requesting" | "granted" | "denied" | "unsupported"
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("idle");

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(4),
          lng: position.coords.longitude.toFixed(4),
        });
        setStatus("granted");
      },
      () => setStatus("denied")
    );
  }, []);

  return { location, status, request };
}
