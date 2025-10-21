import webbrowser
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Serve your built React app (media/dist)
PORT = 5000
DIRECTORY = os.path.join(os.path.dirname(__file__), "media", "dist")

os.chdir(DIRECTORY)

# Start simple local server
handler = SimpleHTTPRequestHandler
httpd = HTTPServer(("localhost", PORT), handler)

print(f"Serving at http://localhost:{PORT}")

webbrowser.open(f"http://localhost:{PORT}/index.html")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    httpd.server_close()
