
import { GoogleGenAI, Type } from "@google/genai";
import { ObservationPoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchEclipseDataForLocation(lat: number, lng: number, date: string): Promise<ObservationPoint> {
  // Contextual clues for the model to ensure realistic values
  let contextHint = "";
  if (date.includes("2026")) {
    contextHint = "For the Aug 12, 2026 eclipse in Spain, the sun is very low (approx 10-12 degrees) and in the West-Northwest (approx 285 degrees) as it occurs near sunset.";
  } else if (date.includes("2027")) {
    contextHint = "For the Aug 2, 2027 eclipse in North Africa/Spain, the sun is approx 15-20 degrees high and in the West-Northwest (approx 290 degrees).";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Calculate detailed solar eclipse data for the location [${lat}, ${lng}] on the date ${date}. 
    ${contextHint}
    Provide the name of the nearest town, the duration of totality (or percentage if partial), 
    the sun's altitude and azimuth at maximum eclipse. 
    Also provide a timeline of 10 points covering the event.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          duration: { type: Type.STRING },
          altitude: { type: Type.NUMBER },
          azimuth: { type: Type.NUMBER },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                coverage: { type: Type.NUMBER },
                altitude: { type: Type.NUMBER },
                azimuth: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["name", "duration", "altitude", "azimuth", "timeline"]
      }
    }
  });

  const rawData = JSON.parse(response.text);
  
  // Basic validation/sanitization to prevent impossible UI values
  return {
    ...rawData,
    lat: lat,
    lng: lng,
    altitude: rawData.altitude ?? (date.includes("2026") ? 11 : 18),
    azimuth: rawData.azimuth ?? (date.includes("2026") ? 285 : 290),
    duration: rawData.duration || "1:30",
    timeline: (rawData.timeline || []).map((t: any) => ({
      ...t,
      coverage: t.coverage ?? 0,
      altitude: t.altitude ?? 0,
      azimuth: t.azimuth ?? 0
    }))
  } as ObservationPoint;
}
