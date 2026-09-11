import httpx
import asyncio


REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"


async def fetch_jobs(career: str, limit: int = 10) -> dict:
    """Fetch real-time remote jobs from Remotive API based on career path."""
    # Map common career titles to search terms
    search_map = {
        "full stack developer": "full stack",
        "frontend developer": "frontend react",
        "backend developer": "backend python",
        "data scientist": "data science",
        "machine learning engineer": "machine learning",
        "devops engineer": "devops",
        "mobile developer": "mobile developer",
        "cloud engineer": "cloud",
        "cybersecurity analyst": "security",
        "ui/ux designer": "ui ux design",
        "game developer": "game developer",
        "blockchain developer": "blockchain",
        "ai engineer": "artificial intelligence",
        "software engineer": "software engineer",
        "web developer": "web developer",
    }

    # Find best search term
    search_term = career.lower()
    for key, value in search_map.items():
        if key in search_term:
            search_term = value
            break

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                REMOTIVE_API_URL,
                params={
                    "search": search_term,
                    "limit": limit
                }
            )
            response.raise_for_status()
            data = response.json()

            jobs = []
            for job in data.get("jobs", [])[:limit]:
                jobs.append({
                    "id": job.get("id"),
                    "title": job.get("title", ""),
                    "company": job.get("company_name", ""),
                    "location": job.get("candidate_required_location", "Worldwide"),
                    "job_type": job.get("job_type", ""),
                    "url": job.get("url", ""),
                    "published_date": job.get("publication_date", ""),
                    "salary": job.get("salary", "Not specified"),
                    "tags": job.get("tags", [])[:5],
                    "company_logo": job.get("company_logo", ""),
                })

            return {
                "jobs": jobs,
                "total": len(jobs),
                "source": "Remotive",
                "search_term": search_term
            }

    except Exception as e:
        print(f"Error fetching jobs: {e}")
        return {
            "jobs": [],
            "total": 0,
            "source": "Remotive",
            "search_term": search_term,
            "error": str(e)
        }
