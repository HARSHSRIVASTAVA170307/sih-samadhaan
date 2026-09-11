import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

QUIZ_GENERATE_PROMPT = """
You are SkillRoute QuizBot — an AI that generates skill assessment questions.

Given a list of skills the student claims to know, generate exactly 5 multiple-choice questions to test their actual skill level.

Rules:
- Questions should range from beginner to advanced
- Each question has 4 options (A, B, C, D) with exactly one correct answer
- Questions should be practical and test real understanding, not just definitions
- Cover different skills from the list when possible

Return ONLY valid JSON (NO MARKDOWN, NO CODE BLOCKS):
{
  "questions": [
    {
      "id": 1,
      "question": "<question text>",
      "skill_tested": "<which skill this tests>",
      "difficulty": "<beginner|intermediate|advanced>",
      "options": {
        "A": "<option A>",
        "B": "<option B>",
        "C": "<option C>",
        "D": "<option D>"
      },
      "correct_answer": "<A|B|C|D>",
      "explanation": "<brief explanation of why the correct answer is correct>"
    }
  ]
}
"""

QUIZ_EVALUATE_PROMPT = """
You are SkillRoute QuizBot — an AI that evaluates skill assessment results.

Given the student's quiz answers and the correct answers, evaluate their overall skill level.

Return ONLY valid JSON (NO MARKDOWN, NO CODE BLOCKS):
{
  "score": <number 0-5>,
  "total": 5,
  "percentage": <number 0-100>,
  "skill_level": "<beginner|intermediate|advanced>",
  "summary": "<2-3 sentence personalized feedback about their performance>",
  "strengths": ["<area they did well>"],
  "areas_to_improve": ["<area they need to work on>"]
}
"""


async def generate_quiz(skills: list) -> dict:
    max_retries = 2
    retry_count = 0

    while retry_count < max_retries:
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": QUIZ_GENERATE_PROMPT},
                    {"role": "user", "content": json.dumps({"skills": skills})}
                ],
                temperature=0.7,
                max_completion_tokens=4000,
                top_p=1,
                stream=False
            )

            content = response.choices[0].message.content
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            return json.loads(content)
        except Exception as e:
            print(f"Error generating quiz: {e}")
            retry_count += 1
            if retry_count >= max_retries:
                raise


async def evaluate_quiz(questions: list, user_answers: dict) -> dict:
    score = 0
    results = []

    for q in questions:
        q_id = str(q["id"])
        user_answer = user_answers.get(q_id, "")
        is_correct = user_answer.upper() == q.get("correct_answer", "").upper()
        if is_correct:
            score += 1
        results.append({
            "id": q["id"],
            "correct": is_correct,
            "user_answer": user_answer,
            "correct_answer": q["correct_answer"],
            "explanation": q.get("explanation", "")
        })

    percentage = (score / len(questions)) * 100 if questions else 0

    if percentage >= 80:
        skill_level = "advanced"
    elif percentage >= 50:
        skill_level = "intermediate"
    else:
        skill_level = "beginner"

    strengths = [r for r in results if r["correct"]]
    weaknesses = [r for r in results if not r["correct"]]

    return {
        "score": score,
        "total": len(questions),
        "percentage": round(percentage),
        "skill_level": skill_level,
        "results": results,
        "strengths": [questions[r["id"]-1].get("skill_tested", "") for r in strengths],
        "areas_to_improve": [questions[r["id"]-1].get("skill_tested", "") for r in weaknesses],
        "summary": f"You scored {score}/{len(questions)} ({round(percentage)}%). Your skill level is assessed as {skill_level}."
    }
