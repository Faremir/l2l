import http.server

URL = ""
PORT = 8000
DIRECTORY = "src"


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


class StoppableHTTPServer(http.server.HTTPServer):

    def run(self):
        try:
            self.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            # Clean-up server (close socket, etc.)
            self.server_close()


if __name__ == '__main__':
    server = StoppableHTTPServer((URL, PORT), Handler)
    server.run()
