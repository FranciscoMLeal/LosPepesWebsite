import os
import re
from datetime import datetime

def get_project_info():
    project_name = input("Enter the project name: ").strip()
    location = input("Enter the project location (e.g., City, Country): ").strip()
    date = input("Enter the project date (e.g., 2023): ").strip()
    client = input("Enter the client name: ").strip()
    description = input("Enter a description of the project: ").strip()

    images = []
    print("\nAdd image URLs for the project (at least one required).")
    print("To finish adding images, leave the URL field empty.")

    while True:
        url = input("Enter image URL (leave empty to finish): ").strip()
        if not url:
            break
        images.append(url)

    if not images:
        print("No images provided. At least one image URL is required.")
        return None

    return {
        "name": project_name,
        "location": location,
        "date": date,
        "client": client,
        "description": description,
        "images": images
    }

def sanitize_key(name):
    # Lowercase, replace spaces with underscores, remove non-alphanum/underscore
    key = name.lower().replace(" ", "_")
    key = re.sub(r'[^a-z0-9_]', '', key)
    return key

def append_project_to_js(js_file):
    project_info = get_project_info()
    if not project_info:
        print("Project creation cancelled.")
        return

    # Read the original JS file
    try:
        with open(js_file, 'r', encoding='utf-8') as f:
            js_content = f.read()
    except Exception as e:
        print(f"Error reading {js_file}: {e}")
        return

    # Find the last closing brace of the projectsData object
    match = re.search(r'(const projectsData\s*=\s*{)(.*?)(\n};)', js_content, re.DOTALL)
    if not match:
        print("Could not find projectsData object in JS file.")
        return

    before = match.group(1)
    body = match.group(2)
    after = match.group(3)

    # Prepare the new project entry
    key = sanitize_key(project_info["name"])
    timestamp = int(datetime.now().timestamp())
    key = f"{key}_{timestamp}"

    # Format images array
    images_str = ",\n      ".join([f"'{img}'" for img in project_info["images"]])

    # You can customize colors or set defaults
    colors = {
        "topBar": "#405FFF",
        "titleSection": "#22D4BC",
        "description": "#BF87FF",
        "gallery": "#FCA9F4",
        "contactForm": "#FF7869"
    }

    colors_str = ",\n            ".join([f"{k}: '{v}'" for k, v in colors.items()])

    # Prepare the JS object string
    new_entry = f"""
  '{key}': {{
    heroPosition: 'top',
    title: '{project_info["name"]}',
    client: '{project_info["client"]}',
    location: '{project_info["location"]}',
    year: '{project_info["date"]}',
    description: `{project_info["description"]}`,
    images: [
      {images_str}
    ],
    colors: {{
            {colors_str}
    }}
  }},"""

    # Insert before the last closing brace
    new_body = body.rstrip() + new_entry + "\n"
    new_js_content = before + new_body + after

    # Write back to the JS file
    try:
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(new_js_content)
        print(f"Added new project '{project_info['name']}' to {js_file} successfully.")
    except Exception as e:
        print(f"Error writing to {js_file}: {e}")

if __name__ == "__main__":
    print("=== Portfolio Updater (projects.js) ===")
    js_file = input("Enter the path to your projects.js file (e.g., projects.js): ").strip()
    if not os.path.isfile(js_file):
        print(f"Error: The file '{js_file}' does not exist.")
    else:
        append_project_to_js(js_file)
