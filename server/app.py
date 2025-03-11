from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource




from config import Config  
from models import db, bcrypt  

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
    
    
class CreateItem(Resource):
    def post(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'You need to be logged in to create an item.'}, 401
        if customer_id != 1:
            return {'error': 'You do not have permission to create items.'}, 403
        customer = Customer.query.get(customer_id)
        if not customer or not customer.is_seller:
            return {'error': 'Only sellers can creatte items.'}, 401


        data = request.get_json()
        name = data.get('name')
        price = data.get('price')
        if not all([name, price]):
            return {'error': 'All the fields are required.'}, 400
        new_item = Item(
            name = name,
            price = price
        )
        
        db.session.add(new_item)
        db.session.commit()
        session['item_id'] = new_item.id
        

        return new_item.to_dict(), 201
       

        
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
                return make_response(jsonify({'error': 'unique constraint'}), 400)
            if Customer.query.filter(Customer.email == email).first():
                return make_response(jsonify({'error': 'unique constraint'}), 400)

            
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
                return {'error': 'customer not found'}, 404
        else:
            return {'error': '401: Not Authorized'}, 401
        


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
       
        new_order = Order(customer_id=customer_id, quantity=quantity, item_id=item_id)
        db.session.add(new_order)
        
        db.session.commit()

        return {'message': 'New order added to the orders successfully.'}, 201
    
class Logout(Resource):
    def delete(self):
         if 'customer_id' in session:
             session.pop('customer_id', None)
             return {'messa': 'Successful logout.'}, 200
         return {'error': 'No active session found.'}, 400


class EditOrder(Resource):
    
    def patch(self, order_id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'message': 'You should be logged in to edit an item.'}, 401
        # order = Order.query.filter(Order.customer_id == customer_id, Order.id == order_id).first()
        order = Order.query.filter_by(id=order_id, customer_id=customer_id).first()

        if not order:
            return {'error': 'Item not found.'}, 404
        data = request.get_json()

        
        if not data:
            return {'error': 'No data provided for update.'}, 400
        for attr, value in data.items():
            if hasattr(order, attr):
                setattr(order, attr, value)
        db.session.commit()

        return {
    'id': order.id,
    'quantity': order.quantity,
    'item_id': order.item.id,
    'item': {
        'id': order.item.id,
        'name': order.item.name,
        'price': order.item.price,
    },  
    'customer_id': order.customer_id,
}, 200
       

class DeleteOrder(Resource):
    
    def delete(self, order_id):
        print("Session data on DELETE request:", session)

        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'You must be logged in to delete an item.'}, 401
        
        order = Order.query.filter(Order.id == order_id, Order.customer_id == customer_id).first()
        if not order:
            return {'error': 'Order not found.'}, 404
        

        db.session.delete(order)
        db.session.commit()
        
        cart_items = Order.query.filter(Order.customer_id == customer_id).all()

        cart_data = [
            {
                'id': order.id,
                'quantity':order.quantity,
                'selected_item': {
                    'id': order.item.id,
                    'name': order.item.name,
                    'price': order.item.price,
                }

            }
            for order in cart_items
        ]

        return cart_data, 200
                 
                 
@app.route('/')
def index():
    return '<h1>Project Server</h1>'



api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Items, '/items')
api.add_resource(Logout, '/logout')
api.add_resource(Cart, '/cart')
api.add_resource(EditOrder, '/cart/<int:order_id>')
api.add_resource(DeleteOrder, '/cart/<int:order_id>/delete')
api.add_resource(CreateItem, '/items')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

# python server/app.py
# sqlite3 /Users/layla/Development/code/se-prep/phase-4/EasyOrder/server/app.db


