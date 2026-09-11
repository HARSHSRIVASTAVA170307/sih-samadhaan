"""
Clarity scoring engine — rule-based logic layer for career decision-making.
This is the "Logic Layer" referenced in the project pitch.
"""


def calculate_clarity_score(assessment: dict) -> dict:
    """
    Rule-based clarity scoring from 3 quick assessment questions.
    Returns a clarity score (0-100) and clarity level.
    """
    score = 0

    # Question 1: Do you have a career in mind?
    career_mind = assessment.get("has_career_in_mind", "no")
    if career_mind == "yes":
        score += 40
    elif career_mind == "somewhat":
        score += 20
    # "no" = 0

    # Question 2: Familiarity with tech career paths
    familiarity = assessment.get("familiarity_with_paths", "not_at_all")
    if familiarity == "very":
        score += 35
    elif familiarity == "somewhat":
        score += 18
    # "not_at_all" = 0

    # Question 3: Primary goal specificity
    goal = assessment.get("primary_goal", "exploring")
    goal_scores = {
        "full_time_job": 25,
        "internship": 20,
        "learning": 12,
        "exploring": 5,
    }
    score += goal_scores.get(goal, 5)

    # Determine clarity level
    if score >= 70:
        level = "focused"
        message = "You have a clear direction! The agent will fine-tune the best path for you."
    elif score >= 40:
        level = "narrowing"
        message = "You have some idea — the agent will evaluate multiple paths and pick the best fit."
    else:
        level = "exploring"
        message = "You're still exploring — the agent will analyze your profile deeply to discover the right path."

    return {
        "clarity_score": min(score, 100),
        "clarity_level": level,
        "message": message,
        "breakdown": {
            "career_direction": career_mind,
            "path_familiarity": familiarity,
            "goal_specificity": goal,
        }
    }


async def analyze_industry_demand(career: str) -> dict:
    """
    Real-time industry demand analysis using Remotive API.
    Fetches actual job counts to determine demand level.
    Falls back to hardcoded estimates if API is unavailable.
    """
    import httpx

    # Map career titles to search terms
    search_map = {
        "ai engineer": "artificial intelligence",
        "machine learning engineer": "machine learning",
        "data scientist": "data science",
        "full stack developer": "full stack",
        "cloud architect": "cloud",
        "devops engineer": "devops",
        "cybersecurity": "security",
        "blockchain developer": "blockchain",
        "software engineer": "software engineer",
        "web developer": "web developer",
        "mobile developer": "mobile",
        "frontend developer": "frontend react",
        "backend developer": "backend",
        "qa engineer": "quality assurance",
        "ui/ux designer": "ui ux design",
    }

    career_lower = career.lower()
    search_term = career_lower
    for key, value in search_map.items():
        if key in career_lower:
            search_term = value
            break

    # Salary estimates (Remotive doesn't always have salary data)
    salary_estimates = {
        "artificial intelligence": "$100k-$180k",
        "machine learning": "$110k-$190k",
        "data science": "$90k-$160k",
        "full stack": "$80k-$150k",
        "cloud": "$120k-$200k",
        "devops": "$90k-$160k",
        "security": "$95k-$170k",
        "blockchain": "$85k-$160k",
        "software engineer": "$80k-$150k",
        "web developer": "$60k-$120k",
        "mobile": "$75k-$140k",
        "frontend react": "$70k-$130k",
        "backend": "$75k-$140k",
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                "https://remotive.com/api/remote-jobs",
                params={"search": search_term, "limit": 50}
            )
            response.raise_for_status()
            data = response.json()

            jobs = data.get("jobs", [])
            job_count = len(jobs)

            # Determine demand level from real job count
            if job_count >= 30:
                demand_level = "trending"
                growth = "very_high"
                openings = "high"
            elif job_count >= 15:
                demand_level = "trending"
                growth = "high"
                openings = "high"
            elif job_count >= 5:
                demand_level = "stable"
                growth = "moderate"
                openings = "moderate"
            else:
                demand_level = "emerging"
                growth = "moderate"
                openings = "low"

            # Extract top skills/tags from real job listings
            all_tags = []
            for job in jobs[:20]:
                all_tags.extend(job.get("tags", []))
            # Count tag frequency
            tag_counts = {}
            for tag in all_tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
            # Sort tags by frequency
            top_skills = [k for k, v in sorted(tag_counts.items(), key=lambda item: item[1], reverse=True)][:8]

            # Extract real job types
            job_types = set()
            for job in jobs[:20]:
                jt = job.get("job_type", "")
                if jt:
                    job_types.add(jt.replace("_", " ").title())

            salary = salary_estimates.get(search_term, "$60k-$120k")

            return {
                "demand_level": demand_level,
                "growth_projection": growth,
                "avg_salary_range": salary,
                "job_openings_estimate": openings,
                "live_job_count": job_count,
                "top_skills_in_demand": top_skills,
                "common_job_types": list(job_types)[:4],
                "data_source": "Remotive API (real-time)",
            }

    except Exception as e:
        print(f"Real-time demand analysis failed, using fallback: {e}")
        # Fallback to estimates
        return {
            "demand_level": "stable",
            "growth_projection": "moderate",
            "avg_salary_range": salary_estimates.get(search_term, "$60k-$120k"),
            "job_openings_estimate": "moderate",
            "live_job_count": None,
            "top_skills_in_demand": [],
            "common_job_types": [],
            "data_source": "estimated (API unavailable)",
        }


async def generate_career_insights(profile: dict, career_decision: dict) -> dict:
    """Generate enriched career insights from AI decision data + real-time market data."""
    career = career_decision.get("career", "")
    demand_info = await analyze_industry_demand(career)

    return {
        "career": career,
        "confidence": career_decision.get("confidence", 0),
        "skill_match": career_decision.get("skill_match_percentage", 0),
        "market_readiness": career_decision.get("market_readiness", 0),
        "industry_demand": demand_info,
        "strengths": career_decision.get("key_strengths", []),
        "gaps": career_decision.get("skill_gaps", []),
        "time_to_ready": career_decision.get("time_to_job_ready", "N/A"),
        "reasoning": career_decision.get("reasoning", ""),
        "alternatives": career_decision.get("alternatives", []),
        "decision_trace": career_decision.get("decision_trace", []),
    }

