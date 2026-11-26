"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Service } from "@/lib/api";
import { API_URL } from "@/lib/api-url";
import { PICK_JOB_EVENT, PICK_SERVICE_EVENT } from "./PickServiceButton";

type Status = "idle" | "sending" | "sent" | "invalid" | "throttled" | "network";
type Kind = "project" | "job";
type FieldErrors = Partial<Record<"kind" | "name" | "email" | "message" | "service", string[]>>;

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg placeholder:text-muted/70 transition focus:border-accent focus:outline-none aria-invalid:border-red-500";

export function ContactForm({ services, lang, dict }: { services: Service[]; lang: Locale; dict: Dictionary }) {
  const t = dict.contact;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [kind, setKind] = useState<Kind>("project");
  const [service, setService] = useState("");

  // "Tell me your idea" in the services section preselects one; "Hiring?" in the experience section switches to a job offer
  useEffect(() => {
    const onPickService = (e: Event) => {
      setKind("project");
      setService(String((e as CustomEvent<number>).detail));
    };
    const onPickJob = () => setKind("job");
    window.addEventListener(PICK_SERVICE_EVENT, onPickService);
    window.addEventListener(PICK_JOB_EVENT, onPickJob);
    return () => {
      window.removeEventListener(PICK_SERVICE_EVENT, onPickService);
      window.removeEventListener(PICK_JOB_EVENT, onPickJob);
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setErrors({});
    try {
      const response = await fetch(`${API_URL}/api/messages/`, {
        method: "POST",
        // Django answers validation errors in this language
        headers: { "Content-Type": "application/json", "Accept-Language": lang },
        body: JSON.stringify({ ...data, kind, service: kind === "project" && data.service ? Number(data.service) : null }),
      });
      if (response.status === 201) {
        form.reset();
        setKind("project");
        setService("");
        setStatus("sent");
      } else if (response.status === 429) {
        setStatus("throttled");
      } else if (response.status === 400) {
        setErrors(await response.json());
        setStatus("invalid");
      } else {
        setStatus("network");
      }
    } catch {
      setStatus("network");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-8 backdrop-blur-sm">
        <p className="font-display text-2xl font-semibold">{t.sent}</p>
        <button type="button" onClick={() => setStatus("idle")} className="cursor-pointer font-mono text-[0.85rem] text-accent hover:underline">
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const errorMessage = { invalid: t.errorInvalid, throttled: t.errorThrottled, network: t.errorNetwork }[
    status as "invalid" | "throttled" | "network"
  ];

  return (
    <form onSubmit={submit} noValidate data-no-burst className="relative flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 backdrop-blur-sm sm:p-8">
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 font-mono text-[0.78rem] text-muted">{t.kind}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-bg/60 p-1">
          {(["project", "job"] as const).map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-lg px-3 py-2 text-center text-[0.92rem] text-muted transition has-checked:bg-accent has-checked:font-semibold has-checked:text-accent-ink has-focus-visible:outline-2 has-focus-visible:outline-accent hover:text-fg has-checked:hover:text-accent-ink"
            >
              <input type="radio" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} className="sr-only" />
              {value === "project" ? t.kindProject : t.kindJob}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label={t.name} errors={errors.name}>
          <input id="contact-name" name="name" required maxLength={120} autoComplete="name" aria-invalid={!!errors.name} className={field} />
        </Field>
        <Field id="contact-email" label={t.email} errors={errors.email}>
          <input id="contact-email" name="email" type="email" required autoComplete="email" aria-invalid={!!errors.email} className={field} />
        </Field>
      </div>
      {kind === "project" && (
        <Field id="contact-service" label={t.service} errors={errors.service}>
          <select id="contact-service" name="service" value={service} onChange={(e) => setService(e.target.value)} className={field}>
            <option value="">{t.serviceNone}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field id="contact-message" label={kind === "job" ? t.messageJob : t.message} errors={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder={kind === "job" ? t.messageJobPlaceholder : t.messagePlaceholder}
          aria-invalid={!!errors.message}
          className={`${field} resize-y`}
        />
      </Field>

      {/* Honeypot: hidden from people, filled in by bots. The API drops messages that have it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMessage && (
        <p role="alert" className="text-[0.92rem] text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer self-start rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition hover:bg-[color-mix(in_srgb,var(--accent)_86%,var(--fg))] disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}

function Field({ id, label, errors, children }: { id: string; label: string; errors?: string[]; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[0.78rem] text-muted">
        {label}
      </label>
      {children}
      {errors?.map((error) => (
        <p key={error} className="text-[0.85rem] text-red-600 dark:text-red-400">
          {error}
        </p>
      ))}
    </div>
  );
}
