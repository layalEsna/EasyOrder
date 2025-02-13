
###################################
# #!/usr/bin/env python3

# # Standard library imports

# # Remote library imports

# from flask import request, make_response, jsonify, session
# from flask_restful import Resource

# # Local imports
# from config import app, db, api

# # Add your model imports
# from models import Customer, Item, Order



# # Views go here!
##########################################
from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource




from config import Config  # Import config class
from models import db, bcrypt  # Now importing from models instead of defining in app.py

# Instantiate app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

# Import models after initializing db to prevent circular imports
from models import Customer, Item, Order  # Importing here avoids circular imports



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
                return {'error': 'All the fields are required.'}, 400

            customer = Customer.query.filter(Customer.username == username).first()

            if not customer or not customer.check_password(password):
                return {'error': 'Wrong username or password.'}, 401

            session['customer_id'] = customer.id
            session.permanent = True
            return {'message': 'Successful login!', 'id': customer.id, 'username': customer.username}, 200

        except Exception as e:
            return {'error': 'Internal server error'}, 500

        


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
        

# class CheckSession(Resource):
#     def get(self):
#         if 'customer_id' in session:
#             customer = Customer.query.get(session['customer_id'])
#             return {'username': customer.username, 'id': customer.id}
#         return {'error': 'Unauthorized'}, 401

        
class Logout(Resource):
    def delete(self):
        session.pop('customer_id', None)
        return '', 204
    

class ItemById(Resource):
    def get(self, item_id):

        item = Item.query.get(item_id)
        if not item:
            return {'error': 'Item not found.'}, 404
        return item.to_dict(), 200
    
class CustomerById(Resource):
    def get(self, customer_id):
        customer_by_id = session.get('customer_id')
        if customer_by_id:
            print(f"Session customer_id: {customer_by_id}")
            customer = Customer.query.filter(Customer.id == customer_id).first()

            if customer:
                print(f"Found customer: {customer.username}")
                return {'username': customer.username}, 200
            else:
                return {'message': 'Customer not found'}, 404

        else:
            return {'message': 'No customer found in session'}, 401

class Cart(Resource):

    def post(self):

        customer_id = session.get('customer_id')
        if not customer_id:
            return {'message': 'You need to be logged in.'}, 401
        
        data = request.get_json()
        quantity = data.get('quantity')
        item_id = data.get('item_id')
        if not all([quantity, item_id]):
            return {'message': 'Quantity and item_id are required.'}, 400
        item = Item.query.get(item_id)
        if not item:
            return {'message': 'Item not found'}, 404
        order_item = Order(customer_id=customer_id, quantity=quantity, item_id=item_id)
        db.session.add(order_item)
        
        db.session.commit()

        return {'message': 'Item added to cart successfully.'}, 201


    def get(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'You need to be logged in to view your cart.'}, 401
        
        cart_items = Order.query.filter(Order.customer_id == customer_id).all()
        if not cart_items:
            return {'message': 'Your cart is empty.'}, 200
        cart_data = [
            {
                'quantity': order.quantity,
                'selected_item': {
                    'name': order.item.name,
                    'price': order.item.price,
                }
            }
            for order in cart_items
        ]

        return cart_data, 200
    
class Logout(Resource):
    def delete(self):
         if 'customer_id' in session:
             session.pop('customer_id', None)
             return {'messa': 'Successful logout.'}, 200
         return {'error': 'No active session found.'}, 400

        
        
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Items, '/items')
api.add_resource(Logout, '/logout')
api.add_resource(ItemById, '/items/<int:item_id>')
api.add_resource(CustomerById, '/customer/<int:customer_id>')
api.add_resource(Cart, '/cart')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

# python server/app.py