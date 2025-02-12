#!/usr/bin/env python3

# Standard library imports

# Remote library imports

from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Customer, Item, Order



# Views go here!

class Items(Resource):
    def get(self):
        items = Item.query.all()
        if not items:
            return make_response({'message': []}), 200
        
        all_items = [
            {
                'id': item.id,
                'name': item.name,
                'price': item.price
            }
            for item in items
        ]
        return all_items, 200

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


api.add_resource(Items, '/items')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

