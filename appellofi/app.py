from flask import Flask

from appellofi import views


def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')

    app.register_blueprint(views.main.bp)
    return app
