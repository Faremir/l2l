import http.server

URL = "localhost"
PORT = 8000
DIRECTORY = "src"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


class StoppableHTTPServer(http.server.HTTPServer):
    protocol_version = 'HTTP/1.0'

    def do_GET(self, body=True):
        try:
            req_header = self.parse_headers()
            self.send_response(200)
            self.send_resp_headers(req_header, 11)
            self.wfile.write('Hello world')
            return
        finally:
            self.finish()

    def run(self):
        print(self)
        try:
            self.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            self.server_close()


if __name__ == '__main__':
    server = StoppableHTTPServer((URL, PORT), Handler)
    print(f"Server running on {URL}:{PORT}!")
    server.run()
