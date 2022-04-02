import _thread
import http.server
import json
import logging
import socketserver

from models import L2lParser

URL = "localhost"
PORT = 8000
DIRECTORY = "src"


class KillableServer(socketserver.TCPServer):

    def server_bind(self):
        import socket

        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind(self.server_address)


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _set_json_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/kill_server'):
            self.interrupt()
        http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        self._set_json_headers()
        logging.info("In POST method!")
        data_string = self.rfile.read(int(self.headers['Content-Length']))

        self.send_response(200)
        self.end_headers()
        data = json.loads(data_string)

        if self.path.startswith('/determine'):
            req = L2lParser.L2l_Parser()
            req.parse(data)

        return

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
