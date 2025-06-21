import re
import openai
import os

def detect_code_type(code):
    # Simple heuristics for code type detection
    if re.search(r'<form|<input|<html|<!DOCTYPE', code, re.I):
        return 'HTML'
    if re.search(r'\bfunction\b|console\.log|var |let |const ', code):
        return 'JavaScript'
    if re.search(r'\bdef |import |print\(', code):
        return 'Python'
    if re.search(r'public static void main|System\.out\.println', code):
        return 'Java'
    if re.search(r'#include <|int main\(', code):
        return 'C/C++'
    if re.search(r'using System;|namespace |class ', code):
        return 'C#'
    if re.search(r'\{\s*[a-zA-Z\-]+\s*:', code):
        return 'CSS'
    if re.search(r'<\?php|echo |\$\w+\s*=|->', code):
        return 'PHP'
    if re.search(r'puts |end|def |class |module ', code):
        return 'Ruby'
    if re.search(r'package main|fmt\.|func main', code):
        return 'Go'
    if re.search(r'fn main\(|let mut |println!\(', code):
        return 'Rust'
    if re.search(r'fun main|val |var |println\(', code):
        return 'Kotlin'
    if re.search(r'func |import Foundation|let |var |print\(', code):
        return 'Swift'
    if re.search(r'type |interface |implements |export |import ', code):
        return 'TypeScript'
    if re.search(r'#!/bin/bash|#!/usr/bin/env bash|echo |fi|done|\$\w+', code):
        return 'Shell'
    return 'Text'

def analyze_form_code(user_input):
    code_type = detect_code_type(user_input)
    if code_type == 'Text':
        analysis = "This is not a code. Please provide a code to analyze your security."
        score = 0
        badges = ["Not Code"]
        return analysis, score, badges, code_type, None

    # Check for required environment variables
    required_envs = [
        "AZURE_OPENAI_API_KEY",
        "AZURE_OPENAI_ENDPOINT",
        "AZURE_OPENAI_API_VERSION",
        "AZURE_OPENAI_DEPLOYMENT"
    ]
    missing = [env for env in required_envs if not os.getenv(env)]
    if missing:
        analysis = f"Missing Azure OpenAI environment variables: {', '.join(missing)}"
        score = 0
        badges = ["Config Error"]
        return analysis, score, badges, code_type

    from openai import AzureOpenAI
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION")
    )
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    prompt = f"""Analyze the following {code_type} code for security flaws. Provide:
1. A plain-language summary of issues.
2. A security score out of 100.
3. 2–3 badges (like 'SQL Safe', 'XSS Risk', 'No Input Validation').
4. If you find vulnerabilities, provide a secure rewritten version of the code with fixes and a short explanation of each fix.

Code ({code_type}):
{user_input}

Respond in this format:
<ANALYSIS>
Your analysis here...

<SCORE>
87

<BADGES>
SQL Safe, XSS Risk

<RECOMMENDATION>
# Secure code with fixes
# ...
# Explanation of fixes: ...
"""

    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4
        )
        content = response.choices[0].message.content
        # Robust parsing: ignore lines before <ANALYSIS> and after <BADGES>
        import re
        analysis, score, badges, recommendation = None, 0, [], None
        analysis_match = re.search(r'<ANALYSIS>(.*?)<SCORE>', content, re.DOTALL)
        score_match = re.search(r'<SCORE>(.*?)<BADGES>', content, re.DOTALL)
        badges_match = re.search(r'<BADGES>(.*?)(<RECOMMENDATION>|$)', content, re.DOTALL)
        recommendation_match = re.search(r'<RECOMMENDATION>(.*)', content, re.DOTALL)
        if analysis_match and score_match and badges_match:
            analysis = analysis_match.group(1).strip()
            try:
                score = int(score_match.group(1).strip().split()[0])
            except Exception:
                score = 0
            badges = [b.strip() for b in badges_match.group(1).strip().replace('\n','').split(',') if b.strip()]
            if recommendation_match:
                recommendation = recommendation_match.group(1).strip()
        else:
            # Try to extract the first <ANALYSIS>, <SCORE>, <BADGES> blocks if present
            try:
                analysis = content.split("<ANALYSIS>")[1].split("<SCORE>")[0].strip()
                score = int(content.split("<SCORE>")[1].split("<BADGES>")[0].strip().split()[0])
                badges = [b.strip() for b in content.split("<BADGES>")[1].split("<RECOMMENDATION>")[0].strip().replace('\n','').split(',') if b.strip()]
                if '<RECOMMENDATION>' in content:
                    recommendation = content.split('<RECOMMENDATION>')[1].strip()
            except Exception:
                analysis = "Sorry, the analysis could not be parsed. Please try again or rephrase your code."
                score = 0
                badges = ["Parse Error"]
                recommendation = None
        return analysis, score, badges, code_type, recommendation
    except Exception as e:
        analysis = f"Error analyzing the code: {str(e)}"
        score = 0
        badges = ["API Error"]
        return analysis, score, badges, code_type, None
