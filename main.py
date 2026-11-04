from flask import Flask

app = Flask(__name__)

@app.route('/admin')
def admin():
    return "fl4g"

@app.route('/')
def hello():
    return "Somos o que fazemos, mas somos, principalmente, o que fazemos para mudar o que somos - Galeano"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
