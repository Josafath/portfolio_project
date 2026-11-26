"use client";

export const PICK_SERVICE_EVENT = "portfolio:pick-service";
export const PICK_JOB_EVENT = "portfolio:pick-job";

const linkStyle = "cursor-pointer font-mono text-[0.85rem] text-accent hover:underline";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

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
    scrollToContact();
  }

  return (
    <button type="button" onClick={pick} className={`${linkStyle} ${className}`}>
      {children}
    </button>
  );
}

/** Switches the contact form to a job offer and scrolls to it. */
export function PickJobButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  function pick() {
    window.dispatchEvent(new Event(PICK_JOB_EVENT));
    scrollToContact();
  }

  return (
    <button type="button" onClick={pick} className={`${linkStyle} ${className}`}>
      {children}
    </button>
  );
}
