import _thread
import http.server
import socketserver

from models import L2lParser

URL = "localhost"
PORT = 8000
DIRECTORY = "src"

STORED_PROCESSES = []


class KillableServer(socketserver.TCPServer):

    def server_bind(self):
        import socket

        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind(self.server_address)


class Handler(http.server.SimpleHTTPRequestHandler):
    processor = L2lParser.L2l_Parser(STORED_PROCESSES)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path.startswith('/kill_server'):
            self.interrupt()
        http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        data_string = self.rfile.read(int(self.headers['Content-Length']))

        result = ""
        if self.path.startswith('/prepare_data'):
            self.processor.prepare_test(data_string)
        elif self.path.startswith('/determine'):
            result = self.processor.parse(data_string)

        STORED_PROCESSES.sort(key=lambda process: process.overall_success_rate)

        response = result.encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(response)


def interrupt(self):
    print("Server is going down, run it again manually!")

    def kill_server(server):
        server.shutdown()

    _thread.start_new_thread(kill_server, (httpd,))
    self.send_error(500)


if __name__ == '__main__':

    httpd = KillableServer((URL, PORT), Handler)
    print(f"Server running on {URL}:{PORT}!")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
