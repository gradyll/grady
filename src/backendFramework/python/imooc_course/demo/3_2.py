from flask import Flask, make_response, request
from datetime import timedelta, datetime
from markupsafe import escape

app = Flask(__name__)

@app.route("/<name>")
def hello_world(name):
    return f"Hello11, {escape(name)}!"
  
@app.route("/cookie")
def cookie():
    response = make_response("cookies success1")
    
    expire_time = datetime.now() + timedelta(days=1)
    
    response.set_cookie('name', 'the username', expires=expire_time)
  
    return response

@app.route("/get_cookie")
def get_cookie():
    name = request.cookies.get('name')
    return f"cookie is {name}"

if __name__ == '__main__':
  app.run()