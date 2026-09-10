import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEET_ID,
} from "astro:env/server";
import { appendRow } from "../lib/sheets";

function timestamp(): string {
  // e.g. "2026-09-10 11:23:45" in UK time; Sheets parses this as a date.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export const server = {
  rsvp: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().trim().min(1),
      email: z.email(),
      rsvp: z.enum(["yes", "no"]),
      count: z.number().int().min(1).optional(),
      dietaries: z.string().trim().optional(),
      // Honeypot: real people never see or fill this.
      website: z.string().optional(),
    }),
    handler: async ({ name, email, rsvp, count, dietaries, website }) => {
      const attending = rsvp === "yes";

      // Bots fill the honeypot; pretend it worked and write nothing.
      if (website) return { attending };

      try {
        await appendRow(
          {
            clientEmail: GOOGLE_CLIENT_EMAIL,
            privateKey: GOOGLE_PRIVATE_KEY,
            sheetId: GOOGLE_SHEET_ID,
          },
          [timestamp(), name, email, attending ? "Yes" : "No", count ?? "", dietaries ?? ""],
        );
      } catch (err) {
        console.error(err);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, something went wrong saving your RSVP. Please try again.",
        });
      }

      return { attending };
    },
  }),
};
