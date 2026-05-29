import { NextResponse } from "next/server";
import { getGeminiChat, isGeminiConfigured } from "@/lib/gemini";

function calculateBMI(weight: number, heightCm: number) {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese Class I";
  if (bmi < 40) return "Obese Class II";
  return "Obese Class III";
}

function calculateHealthScore(data: {
  bmi: number;
  activityLevel: string;
  sleepDuration: number;
  waterIntake: number;
  age: number;
}) {
  let score = 10;
  const { bmi, activityLevel, sleepDuration, waterIntake } = data;

  if (bmi < 18.5 || bmi > 30) score -= 2;
  else if (bmi > 25) score -= 1;

  if (activityLevel === "sedentary") score -= 2;
  else if (activityLevel === "light") score -= 1;
  else if (activityLevel === "very_active") score += 0.5;

  if (sleepDuration < 6) score -= 2;
  else if (sleepDuration < 7) score -= 1;
  else if (sleepDuration > 9) score -= 0.5;

  if (waterIntake < 6) score -= 1.5;
  else if (waterIntake < 8) score -= 0.5;

  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

function getDailyCalories(
  weight: number,
  heightCm: number,
  age: number,
  gender: string,
  activityLevel: string
) {
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { height, weight, age, gender, activityLevel, sleepDuration, waterIntake } = body;

    const bmi = calculateBMI(weight, height);
    const bodyCategory = getBMICategory(bmi);
    const healthScore = calculateHealthScore({ bmi, activityLevel, sleepDuration, waterIntake, age });
    const dailyCalories = getDailyCalories(weight, height, age, gender, activityLevel);
    const hydrationRecommendation = Math.round(weight * 0.033 * 10) / 10;
    const sleepRecommendation = age < 18 ? "8-10 hours" : age < 65 ? "7-9 hours" : "7-8 hours";

    const healthRisks: string[] = [];
    if (bmi > 30) healthRisks.push("Elevated risk of cardiovascular disease due to high BMI");
    if (bmi > 25) healthRisks.push("Increased risk of Type 2 diabetes");
    if (bmi < 18.5) healthRisks.push("Risk of nutrient deficiencies and weakened immunity");
    if (sleepDuration < 6) healthRisks.push("Sleep deprivation linked to cognitive decline and weight gain");
    if (waterIntake < 6) healthRisks.push("Dehydration risk affecting kidney function and energy");
    if (activityLevel === "sedentary") healthRisks.push("Sedentary lifestyle increases risk of chronic diseases");

    let aiRoadmap = [
      "Week 1-2: Establish consistent sleep schedule and increase water intake",
      "Week 3-4: Introduce 30 minutes of moderate exercise 3x per week",
      "Month 2: Optimize nutrition with balanced macros tailored to your goals",
      "Month 3: Increase exercise intensity and track progress metrics",
      "Month 4-6: Fine-tune routines based on body response and energy levels",
    ];

    if (isGeminiConfigured()) {
      try {
        const model = getGeminiChat();
        const prompt = `As a health expert, create a personalized 6-month health improvement roadmap for:
- Age: ${age}, Gender: ${gender}
- BMI: ${bmi.toFixed(1)} (${bodyCategory})
- Activity: ${activityLevel}, Sleep: ${sleepDuration}h, Water: ${waterIntake} glasses/day
- Health Score: ${healthScore}/10

Return ONLY a JSON array of 5-7 strings, each a specific actionable milestone with timeframe. No markdown.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        aiRoadmap = JSON.parse(text);
      } catch {
        /* keep default roadmap */
      }
    }

    return NextResponse.json({
      bmi: Math.round(bmi * 10) / 10,
      bodyCategory,
      healthScore,
      dailyCalories,
      hydrationRecommendation,
      sleepRecommendation,
      healthRisks,
      aiRoadmap,
      macroSplit: {
        protein: Math.round(dailyCalories * 0.3 / 4),
        carbs: Math.round(dailyCalories * 0.4 / 4),
        fat: Math.round(dailyCalories * 0.3 / 9),
      },
    });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
