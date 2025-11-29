from flask import Blueprint
from .auth import authorizer
from .create import creator
from .update import updator
from .delete import deleter
from .read import reader

api = Blueprint("api", __name__, url_prefix="/api")

api.register_blueprint(authorizer, url_prefix="/auth")
api.register_blueprint(creator, url_prefix="/create")
api.register_blueprint(updator, url_prefix="/update")
api.register_blueprint(deleter, url_prefix="/delete")
api.register_blueprint(reader, url_prefix="/read")