import { NextResponse } from "next/server";
import { getGeminiVision, isGeminiConfigured } from "@/lib/gemini";

const DEMO_RESPONSE = {
  foodName: "Grilled Chicken Salad",
  confidence: 0.92,
  calories: 380,
  protein: 35,
  carbs: 18,
  fat: 20,
  fiber: 6,
  sugar: 4,
  sodium: 520,
  healthScore: 8.5,
  micronutrients: {
    vitaminA: "25% DV",
    vitaminC: "40% DV",
    iron: "15% DV",
    calcium: "12% DV",
    potassium: "18% DV",
    vitaminD: "5% DV",
    vitaminB12: "30% DV",
    zinc: "20% DV",
  },
  fitnessSuggestions: [
    "Great post-workout meal — high protein supports muscle recovery",
    "Consider adding quinoa for complex carbs if eating before exercise",
    "Pair with a banana for extra potassium after intense cardio",
  ],
  dietRecommendations: [
    "Excellent choice for a low-carb or Mediterranean diet",
    "Add avocado for healthy fats and increased satiety",
    "This meal fits well into a 1800-2200 calorie daily plan",
  ],
  gymRecommendations: [
    "Ideal within 2 hours post-strength training",
    "Sufficient protein for moderate muscle hypertrophy goals",
    "Light enough for pre-cardio fueling if eaten 90 min before",
  ],
  mealTimingSuggestions: [
    "Best consumed as lunch or post-workout meal (12 PM - 3 PM)",
    "Allow 90 minutes before any intense physical activity",
    "Combine with a light evening snack to balance daily macros",
  ],
  reasoning:
    "This grilled chicken salad provides an excellent balance of lean protein and fresh vegetables. The high protein content (35g) makes it ideal for muscle repair and satiety. Low sugar content and moderate fat from olive oil dressing contribute healthy monounsaturated fats. The variety of greens provides essential micronutrients and fiber for digestive health.",
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

    const prompt = `You are an expert nutritionist and food scientist. Analyze this food image and provide a DETAILED nutritional analysis.

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "foodName": "Name of the food/dish",
  "confidence": 0.0 to 1.0,
  "calories": number (kcal),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "sugar": number (grams),
  "sodium": number (mg),
  "healthScore": 1-10 score,
  "micronutrients": {
    "vitaminA": "% DV",
    "vitaminC": "% DV",
    "iron": "% DV",
    "calcium": "% DV",
    "potassium": "% DV",
    "vitaminD": "% DV",
    "vitaminB12": "% DV",
    "zinc": "% DV"
  },
  "fitnessSuggestions": ["3 fitness tips related to this food"],
  "dietRecommendations": ["3 diet recommendations"],
  "gymRecommendations": ["3 gym/exercise pairing tips"],
  "mealTimingSuggestions": ["3 optimal meal timing tips"],
  "reasoning": "Detailed explanation of WHY these recommendations are given"
}`;

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
    console.error("Food analysis error:", error);
    return NextResponse.json(DEMO_RESPONSE);
  }
}
