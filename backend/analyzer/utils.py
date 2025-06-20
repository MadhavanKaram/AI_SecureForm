import openai
import os

def analyze_form_code(html_code):
    from openai import AzureOpenAI

    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    )

    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

    prompt = f"""Analyze the following HTML form for security flaws. Provide:
1. A plain-language summary of issues.
2. A security score out of 100.
3. 2–3 badges (like 'SQL Safe', 'XSS Risk').

Form HTML:
{html_code}

Respond in this format:
<ANALYSIS>
Your analysis here...

<SCORE>
87

<BADGES>
SQL Safe, XSS Risk
"""

    response = client.chat.completions.create(
        model=deployment,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    content = response.choices[0].message.content

    try:
        analysis = content.split("<ANALYSIS>")[1].split("<SCORE>")[0].strip()
        score = int(content.split("<SCORE>")[1].split("<BADGES>")[0].strip())
        badges = [b.strip() for b in content.split("<BADGES>")[1].strip().split(",")]
    except Exception:
        analysis = "Failed to parse GPT response."
        score = None
        badges = []

    return analysis, score, badges
