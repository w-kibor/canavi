import requests
from bs4 import BeautifulSoup
import json
import os
import time

def scrape_ku_courses():
    all_courses = []
    base_url = "https://www.ku.ac.ke/course-search/?course-level=undergraduate&page="
    
    # Ensure output directory exists
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'ku_courses.json')

    print(f"Starting scrape... Output will be saved to {output_file}")
    
    # Suppress SSL warnings
    requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)

    # Loop through all 15 pages
    for page_num in range(1, 16):
        print(f"Scraping page {page_num}...")
        try:
            url = base_url + str(page_num)
            # verify=False to bypass SSL errors
            response = requests.get(url, timeout=10, verify=False)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # The container for course listings
            # Based on inspection: "gdlr-core-course-item-list" inside "gdlr-core-course-item"
            course_items = soup.find_all('div', class_='gdlr-core-course-item-list')
            
            if not course_items:
                print(f"Warning: No courses found on page {page_num}")
            
            for item in course_items:
                try:
                    # Title
                    title_tag = item.find('h3', class_='gdlr-core-course-item-title')
                    title = title_tag.text.strip() if title_tag else "Unknown Title"
                    
                    # Info Fields (Department, Campus, Course Category)
                    department = "Unknown"
                    campus = "Unknown"
                    category = "Unknown"
                    
                    info_wraps = item.find_all('div', class_='gdlr-core-course-item-info')
                    for info in info_wraps:
                        head = info.find('span', class_='gdlr-core-head')
                        tail = info.find('span', class_='gdlr-core-tail')
                        
                        if head and tail:
                            header_text = head.text.strip().lower()
                            value_text = tail.text.strip()
                            
                            if "department" in header_text:
                                department = value_text
                            elif "campus" in header_text:
                                campus = value_text
                            elif "course category" in header_text:
                                category = value_text
                    
                    # Link
                    link_tag = item.find('a', class_='gdlr-core-course-item-button')
                    link = link_tag['href'] if link_tag else ""
                    
                    course_data = {
                        "title": title,
                        "department": department,
                        "campus": campus,
                        "category": category,
                        "link": link,
                        "institution": "Kenyatta University" # Hardcoded source
                    }
                    all_courses.append(course_data)
                    
                except Exception as e:
                    print(f"Error parsing item on page {page_num}: {e}")
            
            # Be nice to the server
            time.sleep(1)
            
        except requests.exceptions.RequestException as e:
            print(f"Failed to fetch page {page_num}: {e}")

    print(f"Scraping complete. Found {len(all_courses)} courses.")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_courses, f, indent=4, ensure_ascii=False)
    
    print(f"Data saved to {output_file}")

if __name__ == "__main__":
    scrape_ku_courses()
