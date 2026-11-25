"use client";

export const PICK_SERVICE_EVENT = "portfolio:pick-service";

/** Preselects the service in the contact form and scrolls to it. */
export function PickServiceButton({
  serviceId,
  className = "",
  children,
}: {
  serviceId: number;
  className?: string;
  children: React.ReactNode;
}) {
  function pick() {
    window.dispatchEvent(new CustomEvent(PICK_SERVICE_EVENT, { detail: serviceId }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button type="button" onClick={pick} className={`cursor-pointer font-mono text-[0.85rem] text-accent hover:underline ${className}`}>
      {children}
    </button>
  );
}
