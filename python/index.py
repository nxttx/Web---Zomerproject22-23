import flask 
import os

app = flask.Flask(__name__)

@app.route('/')
def index():
    return "Hello World! From python"

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))

    from waitress import serve
    serve(app, host='0.0.0.0', port=port)
    

