import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  types: string[];
  mapUrl: string;
};

export type PlacesSearchResponse = {
  results: PlaceResult[];
  error?: string;
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({ query: z.string().trim().min(2).max(120) })
      .parse(input),
  )
  .handler(async ({ data }): Promise<PlacesSearchResponse> => {
    const apiKey = process.env["GOOGLE_MAPS_API_KEY"];
    const lovableKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey || !lovableKey) {
      return { results: [], error: "Google Maps is not connected yet." };
    }

    let response: Response;
    try {
      response = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": apiKey,
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.types",
        },
        body: JSON.stringify({
          textQuery: data.query,
          pageSize: 8,
          languageCode: "en",
        }),
      });
    } catch (error) {
      console.error("[places] gateway request failed", error);
      return { results: [], error: "Location search is unavailable right now. Please try again." };
    }

    if (response.status === 403) {
      const details: Array<{ reason?: string }> =
        (await response.json().catch(() => ({})))?.error?.details ?? [];
      const reason = details.find((d) => d.reason)?.reason;
      if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
        console.error("[places] server key is referrer-restricted");
        return { results: [], error: "Location search is unavailable right now. Please try again." };
      }
      if (reason === "API_KEY_SERVICE_BLOCKED") {
        console.error("[places] server key does not allow the Places API");
        return { results: [], error: "Location search is unavailable right now. Please try again." };
      }
      console.error("[places] gateway returned 403");
      return { results: [], error: "Location search is unavailable right now. Please try again." };
    }

    if (!response.ok) {
      const body = await response.text();
      console.error(`[places] request failed [${response.status}]: ${body}`);
      return { results: [], error: "Location search is unavailable right now. Please try again." };
    }

    const payload = (await response.json()) as {
      places?: Array<{
        id?: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude?: number; longitude?: number };
        types?: string[];
      }>;
    };

    const results: PlaceResult[] = (payload.places ?? [])
      .filter((place) => place.id && place.displayName?.text)
      .map((place) => {
        const name = place.displayName!.text!;
        const address = place.formattedAddress ?? "";
        const { latitude, longitude } = place.location ?? {};
        const mapUrl =
          latitude != null && longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`.trim())}`;
        return {
          id: place.id!,
          name,
          address,
          types: place.types ?? [],
          mapUrl,
        };
      });

    return { results };
  });
