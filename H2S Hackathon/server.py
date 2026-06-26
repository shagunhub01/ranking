import http.server
import socketserver
import socket
import os
import sys
import json
import base64
from urllib.parse import urlparse, parse_qs
from ranker import run_ranking, export_shortlist_to_csv, CANDIDATES

PORT = 8000
USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        # Create user database with initial mock account
        initial_users = [
            {
                "email": "recruiter@talentiq.ai",
                "password": "admin123",
                "name": "Sarah Jenkins",
                "company": "SkillMatch"
            }
        ]
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(initial_users, f, indent=2)
        return initial_users
    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    try:
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

def load_user_candidates(email):
    if not email:
        return []
    safe_email = "".join(c for c in email if c.isalnum() or c in ['.', '_', '-']).strip().lower()
    filename = f"candidates_{safe_email}.json"
    if not os.path.exists(filename):
        return []
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading candidates for {email}: {e}")
        return []

def save_user_candidates(email, candidates):
    if not email:
        return
    safe_email = "".join(c for c in email if c.isalnum() or c in ['.', '_', '-']).strip().lower()
    filename = f"candidates_{safe_email}.json"
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(candidates, f, indent=2)
    except Exception as e:
        print(f"Error saving candidates for {email}: {e}")

def save_uploaded_file(email, filename, content_str, encoding):
    if not email:
        return ""
    safe_email = "".join(c for c in email if c.isalnum() or c in ['.', '_', '-']).strip().lower()
    dir_path = os.path.join("uploaded_resumes", safe_email)
    if not os.path.exists(dir_path):
        try:
            os.makedirs(dir_path)
        except Exception as e:
            print(f"Error creating directory {dir_path}: {e}")
            return ""
    
    file_path = os.path.join(dir_path, filename)
    try:
        if encoding == 'base64':
            file_bytes = base64.b64decode(content_str)
            with open(file_path, "wb") as f:
                f.write(file_bytes)
        else:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content_str)
        return f"/uploaded_resumes/{safe_email}/{filename}"
    except Exception as e:
        print(f"Error saving uploaded resume file: {e}")
        return ""

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent browser caching of development files
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        # Custom route to retrieve user specific candidate details
        if parsed_url.path == '/api/candidates':
            params = parse_qs(parsed_url.query)
            email = params.get('email', [''])[0].strip().lower()
            
            candidates = load_user_candidates(email)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(candidates).encode('utf-8'))
            return

        # Serve uploaded resume files dynamically
        if parsed_url.path.startswith('/uploaded_resumes/'):
            clean_path = parsed_url.path.lstrip('/')
            if not clean_path.startswith('uploaded_resumes'):
                self.send_response(403)
                self.end_headers()
                return
                
            if os.path.exists(clean_path) and os.path.isfile(clean_path):
                self.send_response(200)
                if clean_path.lower().endswith('.pdf'):
                    self.send_header('Content-Type', 'application/pdf')
                elif clean_path.lower().endswith('.docx'):
                    self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                else:
                    self.send_header('Content-Type', 'text/plain; charset=utf-8')
                self.send_header('Content-Disposition', f'inline; filename="{os.path.basename(clean_path)}"')
                self.end_headers()
                
                try:
                    with open(clean_path, 'rb') as f:
                        self.wfile.write(f.read())
                except Exception as ex:
                    print(f"Error reading file: {ex}")
                return
            else:
                self.send_response(404)
                self.end_headers()
                return
            
        super().do_GET()

    def do_POST(self):
        # Dynamic HR Sign Up route
        if self.path == '/api/signup':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                params = json.loads(post_data.decode('utf-8'))
                email = params.get('email', '').strip().lower()
                password = params.get('password', '')
                name = params.get('name', '').strip()
                company = params.get('company', '').strip()
                
                if not email or not password or not name:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Missing required signup fields"}).encode('utf-8'))
                    return
                
                users = load_users()
                if any(u['email'] == email for u in users):
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "An account with this email already exists"}).encode('utf-8'))
                    return
                
                users.append({
                    "email": email,
                    "password": password,
                    "name": name,
                    "company": company
                })
                save_users(users)
                
                # Initialize empty candidates database for this new user
                save_user_candidates(email, [])
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "HR account created successfully"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # Dynamic HR Login route
        if self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                params = json.loads(post_data.decode('utf-8'))
                email = params.get('email', '').strip().lower()
                password = params.get('password', '')
                
                users = load_users()
                user = next((u for u in users if u['email'] == email and u['password'] == password), None)
                
                if user:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "status": "success",
                        "user": {
                            "email": user["email"],
                            "name": user["name"],
                            "company": user.get("company", "")
                        }
                    }).encode('utf-8'))
                else:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Invalid email or password credentials"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # Dynamic Resume Upload route
        if self.path == '/api/upload':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                params = json.loads(post_data.decode('utf-8'))
                email = params.get('email', '').strip().lower()
                files = params.get('files', [])
                
                if not email:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Recruiter session email required"}).encode('utf-8'))
                    return
                
                from parser import extract_text_from_docx, extract_text_from_pdf, parse_resume_text
                
                candidates = load_user_candidates(email)
                newly_parsed = []
                
                for f in files:
                    name = f.get('name', '')
                    content_str = f.get('content', '')
                    encoding = f.get('encoding', 'text')
                    
                    raw_text = ""
                    if encoding == 'base64':
                        file_bytes = base64.b64decode(content_str)
                        if name.endswith('.docx'):
                            raw_text = extract_text_from_docx(file_bytes)
                        elif name.endswith('.pdf'):
                            raw_text = extract_text_from_pdf(file_bytes)
                        else:
                            raw_text = file_bytes.decode('utf-8', errors='ignore')
                    else:
                        raw_text = content_str
                    
                    # Save physical file to server storage
                    resume_url = save_uploaded_file(email, name, content_str, encoding)
                    
                    parsed_cand = parse_resume_text(raw_text, name)
                    parsed_cand['resume_url'] = resume_url
                    
                    # Prevent exact duplicate email records in the user workspace list
                    existing_idx = next((i for i, c in enumerate(candidates) if c['email'].lower() == parsed_cand['email'].lower()), None)
                    if existing_idx is not None:
                        parsed_cand['id'] = candidates[existing_idx]['id']
                        candidates[existing_idx] = parsed_cand
                    else:
                        candidates.append(parsed_cand)
                        
                    newly_parsed.append(parsed_cand)
                
                save_user_candidates(email, candidates)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "candidates": candidates,
                    "parsed": newly_parsed
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # Custom route to run dynamic AI candidate ranking based on JDs and custom weights
        if self.path == '/api/rank':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                params = json.loads(post_data.decode('utf-8'))
                skills = params.get('skills', [])
                weights = params.get('weights', None)
                target_experience = params.get('target_experience', 5)
                email = params.get('email', '').strip().lower()
                
                # Fetch only user-specific candidate lists
                user_candidates = load_user_candidates(email)
                
                # Call ranker script to score and sort candidates
                ranked_candidates = run_ranking(skills, weights, target_experience, user_candidates)
                
                # Regenerate CSV shortlist file on server filesystem
                export_shortlist_to_csv(ranked_candidates, filepath="ranked_shortlist.csv")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                top_matches = len([c for c in ranked_candidates if c["score"] >= 88])
                avg_score = int(sum(c["score"] for c in ranked_candidates) / len(ranked_candidates)) if ranked_candidates else 0
                
                response_body = {
                    "status": "success",
                    "candidates": ranked_candidates,
                    "stats": {
                        "totalCandidates": len(ranked_candidates),
                        "topMatches": top_matches,
                        "averageMatchScore": avg_score,
                        "uploadedResumes": len(ranked_candidates)
                    }
                }
                self.wfile.write(json.dumps(response_body).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # Reset candidates and CSV shortlist route
        if self.path == '/api/reset':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                params = json.loads(post_data.decode('utf-8'))
                email = params.get('email', '').strip().lower()
                
                if email:
                    safe_email = "".join(c for c in email if c.isalnum() or c in ['.', '_', '-']).strip().lower()
                    filename = f"candidates_{safe_email}.json"
                    if os.path.exists(filename):
                        try:
                            os.remove(filename)
                        except Exception as ex:
                            print(f"Error removing {filename}: {ex}")
                    
                    # Remove physical uploaded resumes directory
                    resumes_dir = os.path.join("uploaded_resumes", safe_email)
                    if os.path.exists(resumes_dir):
                        import shutil
                        try:
                            shutil.rmtree(resumes_dir)
                        except Exception as ex:
                            print(f"Error removing uploaded resumes dir: {ex}")
                
                # Truncate ranked_shortlist.csv if exists
                if os.path.exists("ranked_shortlist.csv"):
                    try:
                        with open("ranked_shortlist.csv", "w", newline="", encoding="utf-8") as f:
                            f.write("")
                    except Exception as ex:
                        print(f"Error clearing CSV: {ex}")
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Workspace reset successfully"}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return
            
        self.send_response(404)
        self.end_headers()

class ThreadedTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = (os.name != 'nt')

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Initialize users database
    load_users()
    
    try:
        with ThreadedTCPServer(("0.0.0.0", PORT), NoCacheHTTPRequestHandler) as httpd:
            print("===================================================")
            print("         SkillMatch Recruitment Platform")
            print("===================================================")
            print(f"Server started on port {PORT} (IPv4)...")
            print("Serving files with caching disabled...")
            print("Press Ctrl+C to stop.")
            httpd.serve_forever()
    except Exception as e:
        print(f"Error starting server: {e}", file=sys.stderr)

if __name__ == '__main__':
    main()
