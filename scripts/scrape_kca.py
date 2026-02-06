import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re

def scrape_kca_courses():
    base_url = "https://www.kcau.ac.ke/all-courses/"
    
    # Output file
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'kca_courses.json')
    
    print(f"Fetching {base_url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(base_url, headers=headers, timeout=20, verify=False)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        links = soup.find_all('a')
        course_urls = set()
        
        # Collect unique course URLs
        for link in links:
            href = link.get('href', '')
            if '/course/' in href and '/course_category/' not in href:
                course_urls.add(href)
        
        print(f"Found {len(course_urls)} unique course links.")
        
        all_courses = []
        
        for i, url in enumerate(course_urls):
            print(f"[{i+1}/{len(course_urls)}] Processing: {url}")
            
            # Extract basic info from URL/Title logic without visiting every page if possible,
            # BUT visiting ensures validity. For speed, we can visit.
            
            try:
                # We can deduce a lot from the URL itself to save time/errors
                slug = url.strip('/').split('/')[-1]
                
                # Title formatting from slug
                # e.g. bachelor-of-science-in-gaming -> Bachelor Of Science In Gaming
                title = slug.replace('-', ' ').title()
                
                # Better: Fetch page for accurate title
                try:
                    c_resp = requests.get(url, headers=headers, timeout=10, verify=False)
                    c_soup = BeautifulSoup(c_resp.content, 'html.parser')
                    
                    if c_soup.title:
                        page_title = c_soup.title.string.split('-')[0].strip()
                        if page_title:
                            title = page_title
                except:
                    print(f"  Could not fetch {url}, using slug for title.")

                # Category Inference
                category = "General"
                lower_title = title.lower()
                if "bachelor" in lower_title or "degree" in lower_title:
                    category = "Undergraduate"
                elif "diploma" in lower_title:
                    category = "Diploma"
                elif "certificate" in lower_title:
                    category = "Certificate"
                elif "master" in lower_title:
                    category = "Masters"
                elif "phd" in lower_title or "doctor" in lower_title:
                    category = "PhD"

                # Department Inference (Keywords)
                department = "KCA University"
                if "business" in lower_title or "commerce" in lower_title or "accounting" in lower_title:
                    department = "School of Business"
                elif "technology" in lower_title or "computer" in lower_title or "gaming" in lower_title or "software" in lower_title:
                    department = "School of Technology"
                elif "education" in lower_title:
                    department = "School of Education"
                elif "arts" in lower_title or "counselling" in lower_title:
                    department = "School of Arts & Social Sciences"

                course_data = {
                    "title": title,
                    "department": department,
                    "campus": "Main Campus",
                    "category": category,
                    "link": url,
                    "institution": "KCA University"
                }
                all_courses.append(course_data)
                
            except Exception as e:
                print(f"Error processing {url}: {e}")
                
            # Rate limit slightly
            # time.sleep(0.1) 

        # Save to JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_courses, f, indent=4, ensure_ascii=False)
            
        print(f"Done! Saved {len(all_courses)} courses to {output_file}")
        
    except Exception as e:
        print(f"Fatal Error: {e}")

if __name__ == "__main__":
    requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)
    scrape_kca_courses()
