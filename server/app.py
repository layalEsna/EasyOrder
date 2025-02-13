#!/usr/bin/env python3

# Standard library imports

# Remote library imports

from flask import request, make_response, jsonify, session
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
    
class Signup(Resource):
    
    def post(self):

        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            if not all([username, password, confirm_password, email]):
                return make_response(jsonify({'error': 'All the fields are required.'}), 400)
            if password != confirm_password:
                return make_response(jsonify({'error': 'Password not match.'}), 400)
            if Customer.query.filter(Customer.username==username).first():
                return make_response(jsonify({'error': 'Username already exists.'}), 400)
            if Customer.query.filter(Customer.email == email).first():
                return make_response(jsonify({'error': 'Email already exists.'}), 400)

            
            new_customer = Customer(
                username = username,
                password = password,
                email = email
            )

            db.session.add(new_customer)
            db.session.commit()

            
            session['customer_id'] = new_customer.id
            session.permanent = True 

            return make_response(jsonify({'id': new_customer.id, 'username': new_customer.username, 'email': new_customer.email}), 201)

        except Exception as e:
            return make_response(jsonify({'error': f'Internal error: {e}'}), 500)
        
class Login(Resource):
    
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if not all([username, password]):
                return jsonify({'error': 'All the fields are required.'}), 400

            customer = Customer.query.filter(Customer.username == username).first()

            if not customer or not customer.check_password(password):
                return jsonify({'error': 'Wrong username or password.'}), 401

            session['customer_id'] = customer.id
            session.permanent = True
            return make_response(jsonify({'message': 'Successful login!', 'id': customer.id, 'username': customer.username}), 200)

        except Exception as e:
            return make_response(jsonify({'error': f'Internal error: {e}'}), 500)
        


class CheckSession(Resource):
    def get(self):
        
        customer_id = session.get('customer_id')
        
        if customer_id:
            
            customer = Customer.query.filter(Customer.id == customer_id).first()
            
            if customer:
               
                return {'customer': customer.to_dict()}, 200
            else:
              
                return {'message': 'customer not found'}, 404
        else:
          
            return {'message': '401: Not Authorized'}, 401
        
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Items, '/items')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

# python server/app.py