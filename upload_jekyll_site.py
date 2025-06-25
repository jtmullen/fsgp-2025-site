import os
import requests
from bs4 import BeautifulSoup
import json
import base64 # Import the base64 module

def extract_html_content(html_file_path, target_div_id):
    """
    Reads an HTML file, extracts the inner HTML content of a specific div.
    """
    try:
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        target_div = soup.find('div', id=target_div_id)

        if target_div:
            extracted_html = str(target_div)
            return extracted_html
        else:
            print(f"Error: Div with ID '{target_div_id}' not found in {html_file_path}")
            return None
    except Exception as e:
        print(f"Error extracting HTML from {html_file_path}: {e}")
        return None

def upload_to_wordpress(wp_url, wp_username, wp_app_password, page_id, acf_field_name, html_content):
    """
    Uploads the extracted HTML content to a WordPress page via the REST API.
    """
    api_url = f"{wp_url}/wp-json/wp/v2/pages/{page_id}"
    
    # Authentication header for Application Passwords
    # Corrected: Using base64.b64encode
    auth_string = f"{wp_username}:{wp_app_password}".encode('utf-8')
    encoded_auth = base64.b64encode(auth_string).decode('utf-8')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {encoded_auth}"
    }

    # Data payload for updating the ACF field
    data = {
        "acf": {
            acf_field_name: html_content
        }
    }

    try:
        response = requests.post(api_url, headers=headers, data=json.dumps(data))
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        print(f"Successfully updated WordPress page ID {page_id}. Status Code: {response.status_code}")
        # print("Response:", response.json()) # Uncomment for full response details
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
        print("Response Body:", response.text)
        exit(1) # Exit with an error code
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
        exit(1)
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
        exit(1)
    except requests.exceptions.RequestException as err:
        print(f"Oops: Something Else: {err}")
        exit(1)

if __name__ == "__main__":
    # Get environment variables from GitHub Actions
    wp_url = os.getenv("WP_URL")
    wp_username = os.getenv("WP_USERNAME")
    wp_app_password = os.getenv("WP_APPLICATION_PASSWORD")
    wp_page_id = os.getenv("WP_PAGE_ID")
    jekyll_html_path = os.getenv("JEKYLL_HTML_PATH")
    target_div_id = os.getenv("TARGET_DIV_ID")
    acf_field_name = os.getenv("ACF_FIELD_NAME")

    # Basic validation of environment variables
    if not all([wp_url, wp_username, wp_app_password, wp_page_id, jekyll_html_path, target_div_id, acf_field_name]):
        print("Error: Missing one or more required environment variables.")
        print(f"WP_URL: {wp_url}, WP_USERNAME: {wp_username}, WP_PAGE_ID: {wp_page_id}, JEKYLL_HTML_PATH: {jekyll_html_path}, TARGET_DIV_ID: {target_div_id}, ACF_FIELD_NAME: {acf_field_name}")
        exit(1)

    print(f"Extracting HTML from {jekyll_html_path} div #{target_div_id}...")
    extracted_html = extract_html_content(jekyll_html_path, target_div_id)

    if extracted_html is None:
        print("Failed to extract HTML content. Exiting.")
        exit(1)

    processed_html = extracted_html.replace(r'\[', r'\\[')
    processed_html = processed_html.replace(r'\]', r'\\]')
    
    # print(f"Extracted HTML (first 200 chars): {extracted_html[:200]}...") # For debugging

    print(f"Uploading content to WordPress page ID {wp_page_id}...")
    upload_to_wordpress(wp_url, wp_username, wp_app_password, wp_page_id, acf_field_name, processed_html)