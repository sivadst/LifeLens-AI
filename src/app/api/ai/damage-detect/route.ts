import { NextResponse } from "next/server";
import { getGeminiVision, isGeminiConfigured } from "@/lib/gemini";

const DEMO_RESPONSE = {
  deviceType: "Smartphone",
  overallCondition: "Moderate Damage",
  defects: [
    { type: "Screen Crack", severity: "High", location: "Upper-right corner extending to center", description: "Spider web crack pattern originating from impact point" },
    { type: "Scratches", severity: "Low", location: "Back panel", description: "Minor surface scratches from daily use" },
    { type: "Dent", severity: "Medium", location: "Bottom-left corner", description: "Small dent from drop impact" },
  ],
  severityScore: 6.5,
  repairDifficulty: "Moderate",
  estimatedCostRange: "$80 - $150",
  maintenanceAdvice: [
    "Apply a screen protector immediately to prevent crack propagation",
    "Use a protective case to prevent further impact damage",
    "Avoid exposing the cracked screen to moisture or dust",
    "Consider screen replacement within 2 weeks to prevent touch issues",
  ],
  preventionTips: [
    "Use a tempered glass screen protector rated 9H hardness",
    "Invest in a shock-absorbing case with raised edges",
    "Avoid placing device in pockets with keys or coins",
    "Use a wrist strap or pop-socket for better grip",
    "Regular cleaning with microfiber cloth prevents abrasive damage",
  ],
};

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(DEMO_RESPONSE);
    }

    const model = getGeminiVision();

    const prompt = `You are an expert hardware diagnostician and repair technician. Analyze this device/gadget image for damage.

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "deviceType": "Type of device (Smartphone, Laptop, Tablet, etc.)",
  "overallCondition": "Excellent/Good/Moderate Damage/Severe Damage/Critical",
  "defects": [
    {
      "type": "Type of defect (Crack, Dent, Scratch, Water Damage, Screen Issue, etc.)",
      "severity": "Low/Medium/High/Critical",
      "location": "Where on the device",
      "description": "Detailed description of the defect"
    }
  ],
  "severityScore": 1-10 (10 = worst),
  "repairDifficulty": "Easy/Moderate/Difficult/Expert Only",
  "estimatedCostRange": "$XX - $YY",
  "maintenanceAdvice": ["4-5 immediate maintenance steps"],
  "preventionTips": ["4-5 prevention tips for future"]
}

If the image doesn't show a device or no damage is visible, still respond with the structure but indicate "No damage detected" appropriately.`;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Damage detection error:", error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
