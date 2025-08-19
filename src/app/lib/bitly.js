import { BitlyClient } from "bitly";

const bitly = new BitlyClient(process.env.NEXT_PUBLIC_BITLY_TOKEN);

export async function shortenUrl(longUrl) {
  try {
    const validUrl = longUrl.startsWith("http") ? longUrl : `https://${longUrl}`;
    const response = await bitly.shorten(validUrl);
    return response.link;
  } catch (error) {
    console.error("Bitly Error:", error);
    return longUrl; // Fallback
  }
}

export async function getClicks(shortUrl) {
  try {
    // Mock data for local development
    if (process.env.NODE_ENV === "development") {
      return [{ click_date: new Date().toISOString(), user_agent: "Test" }];
    }
    const response = await bitly.clicks(shortUrl);
    return response.clicks || [];
  } catch (error) {
    console.error("Bitly Clicks Error:", error);
    return [];
  }
}