import os
import shutil
from datetime import datetime
import re

# Define a list of background colors to cycle through
background_colors = [
    "#405FFF",
    "#22D4BC",
    "#BF87FF",
    "#FCA9F4",
    "#FF7869",
    "#FCA949",
    "#FFFF54"
]

def get_project_info():
    project_name = input("Enter the project name: ").strip()
    location = input("Enter the project location (e.g., City, Country): ").strip()
    date = input("Enter the project date (e.g., 2023): ").strip()
    client = input("Enter the client name: ").strip()
    description = input("Enter a description of the project (use ): ").strip()

    images = []
    print("\nAdd images for the project (provide at least one set of mobile and desktop image file paths).")
    print("To finish adding images, leave the file path fields empty.")
    
    while True:
        mobile_path = input("Enter mobile image file path (leave empty to finish): ").strip()
        if not mobile_path:
            break
        if not os.path.isfile(mobile_path):
            print("Mobile image file not found. Please enter a valid file path.")
            continue

        desktop_path = input("Enter desktop image file path: ").strip()
        if not desktop_path:
            print("Desktop image file path is required if mobile image is provided.")
            continue
        if not os.path.isfile(desktop_path):
            print("Desktop image file not found. Please enter a valid file path.")
            continue

        images.append({"mobile": mobile_path, "desktop": desktop_path})

    if not images:
        print("No images provided. At least one set of mobile and desktop images is required.")
        return None

    return {
        "name": project_name,
        "location": location,
        "date": date,
        "client": client,
        "description": description,
        "images": images
    }

def sanitize_filename(filename):
    return "".join(c for c in filename if c.isalnum() or c in (' ', '_', '-')).rstrip()

def copy_images(project_info, images_dir, project_id):
    relative_image_paths = []
    for idx, image_pair in enumerate(project_info["images"], start=1):
        mobile_src = image_pair["mobile"]
        desktop_src = image_pair["desktop"]

        mobile_ext = os.path.splitext(mobile_src)[1]
        desktop_ext = os.path.splitext(desktop_src)[1]

        mobile_filename = f"{project_id}_image{idx}_mobile{mobile_ext}"
        desktop_filename = f"{project_id}_image{idx}_desktop{desktop_ext}"

        mobile_dest = os.path.join(images_dir, mobile_filename)
        desktop_dest = os.path.join(images_dir, desktop_filename)

        try:
            shutil.copy2(mobile_src, mobile_dest)
            shutil.copy2(desktop_src, desktop_dest)
        except Exception as e:
            print(f"Error copying images: {e}")
            continue

        relative_image_paths.append({
            "mobile": f"images/{mobile_filename}".replace("\\", "/"),
            "desktop": f"images/{desktop_filename}".replace("\\", "/")
        })

    return relative_image_paths

def get_next_background_color(html_content):
    # Search for the last used color in the 'container-fluid' class
    matches = re.findall(r'background-color: ?(#\w{6})', html_content)
    
    # Find the last color that was used
    if matches:
        last_color = matches[0]  # First match is the latest due to order in HTML
        if last_color in background_colors:
            # Get the next color in the sequence
            current_index = background_colors.index(last_color)
            next_color = background_colors[(current_index + 1) % len(background_colors)]
        else:
            # Default to first color if last color isn't in the list
            next_color = background_colors[0]
    else:
        # If no color found, default to first color in list
        next_color = background_colors[0]
    
    return next_color

def add_project_to_html(html_file):
    project_info = get_project_info()
    if not project_info:
        print("Project creation cancelled.")
        return

    html_dir = os.path.dirname(os.path.abspath(html_file))
    images_dir = os.path.join(html_dir, "images")

    if not os.path.exists(images_dir):
        try:
            os.makedirs(images_dir)
            print(f"Created images directory at '{images_dir}'.")
        except Exception as e:
            print(f"Error creating images directory: {e}")
            return

    timestamp = int(datetime.now().timestamp())
    sanitized_name = sanitize_filename(project_info["name"].lower().replace(" ", "_"))
    project_id = f"{sanitized_name}_{timestamp}"

    relative_images = copy_images(project_info, images_dir, project_id)
    if not relative_images:
        print("Failed to copy images. Project creation aborted.")
        return

    unique_id = f"carousel_{project_id}"

    # Read the original HTML to find the last used background color
    try:
        with open(html_file, 'r', encoding='utf-8') as file:
            original_html = file.read()
    except FileNotFoundError:
        print(f"Error: The file '{html_file}' was not found.")
        return
    except Exception as e:
        print(f"Error reading the HTML file: {e}")
        return

    # Determine the next color to use
    background_color = get_next_background_color(original_html)

    # HTML content for the new project section
    project_html = f"""
    <!-- Project - {project_info["name"]} - auto insert script -->
    <div id="{unique_id}" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner carrousel-portfolio-height">
    """
    
    for i, image in enumerate(relative_images):
        active_class = "active" if i == 0 else ""
        project_html += f"""
          <div class="carousel-item {active_class}" id="{unique_id}-item-{i}">
            <img src="{image['mobile']}" class="d-block w-100 d-sm-none" alt="Slide {i + 1} Mobile">
            <img src="{image['desktop']}" class="d-block w-100 d-none d-sm-block" alt="Slide {i + 1} Desktop">
          </div>
        """
    
    project_html += f"""
        </div>
        <a class="carousel-control-prev" href="#{unique_id}" role="button" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </a>
        <a class="carousel-control-next" href="#{unique_id}" role="button" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </a>
    </div>  
    """

    project_html += f"""
    <!-- Project Info -->
    <div class="container-fluid separadores-portfolio" style="background-color:{background_color};">
        <div class="row">
            <div class="col-md-6 location_date">
                <h1>{project_info["name"]}</h1>
                <h2>{project_info["location"]} - {project_info["date"]}</h2>
                <h2>{project_info["client"]}</h2>
            </div>
            <div class="col-md-6">
                <p style="margin-top:20px">{project_info["description"]}</p>
            </div>
        </div>
    </div>
    """

    marker = "<!-- Portfolio Updater start here -->"
    updated_html = original_html.replace(marker, marker + "\n" + project_html)

    try:
        with open(html_file, 'w', encoding='utf-8') as file:
            file.write(updated_html)
    except Exception as e:
        print(f"Error writing to the HTML file: {e}")
        return

    print(f"\nAdded new project '{project_info['name']}' to the HTML portfolio successfully.")
    print(f"Images have been saved to the '{images_dir}' directory.")

if __name__ == "__main__":
    print("=== Portfolio Updater ===")
    html_file = input("Enter the path to your HTML portfolio file (e.g., portfolio.html): ").strip()
    if not os.path.isfile(html_file):
        print(f"Error: The file '{html_file}' does not exist.")
    else:
        add_project_to_html(html_file)
