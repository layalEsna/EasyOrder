from flask import Flask, request, make_response, jsonify, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource


# only logout

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
    
# @app.before_request
# def checked_if_logged_in():
#     customer_id = session.get('customer_id')
#     if not customer_id:
#         return {'error': 'Unauthorized'}, 401
#     if customer_id != 1:
#         return {'error': 'You do not have permission to create items.'}, 403  

    
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
    
    

    def get(self, order_id=None):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'You need to be logged in to view your cart.'}, 401
        
        if order_id:
            
            order = Order.query.filter(Order.id == order_id, Order.customer_id == customer_id).first()
            if not order:
                return {'error': 'Order not found.'}, 404
            
            item = Item.query.get(order.item_id)
            if not item:
                return {'error': 'Item not found.'}, 404
            return {
                'order_id': order.id,
                'quantity': order.quantity,
                'item_id': item.id,
                'item_name': item.name,
                'item_price': item.price,
            }, 200

            
        
        cart_items = Order.query.filter(Order.customer_id == customer_id).all()
        if not cart_items:
            return {'message': 'Your cart is empty.'}, 200
        cart_data = [
            {
                'id': order.id,
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


class Checkout(Resource):
    def post(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'You must be logged in to checkout.'}
        orders = Order.query.filter(Order.customer_id == customer_id).all()
        if not orders:
            return {'message': 'Your cart is empty.'}, 200
        # return [order.to_dict() for order in orders], 200
        Order.query.filter(Order.customer_id == customer_id).delete()
        db.session.commit()
        return {'message': 'Checkout successful.'}, 200
        
class EditOrder(Resource):
    

    def get(self, order_id):

        customer_id = session.get('customer_id')
        
        if not customer_id:
            return {'message': 'You should be logged in to edit an item.'}, 401
        order = Order.query.filter(Order.id == order_id, Order.customer_id == customer_id).first()
        if not order:

            return {'error': 'Item not found.'}, 404
       
        return order.to_dict(), 200


    def patch(self, order_id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'message': 'You should be logged in to edit an item.'}, 401
        order = Order.query.filter(Order.customer_id == customer_id, Order.id == order_id).first()
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
            'order_id': order.id,
            'quantity': order.quantity,
            'item_id': order.item.id,
            'item_name': order.item.name,
            'item_price': order.item.price,
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

# #######
class ItemByCustomers(Resource):
    def get(self , item_id):
        customers_item_purchase = Order.query.filter(Order.item_id == item_id, Order.customer_id.isnot(None)).all()
        if not customers_item_purchase:
            return {'message': 'no customer bought the item'}, 200
        return [{
            'id': order.customer.id,
            'name': order.customer.username,
            'email': order.customer.email,
        }
        for order in customers_item_purchase
        if order.customer

        ], 200
    
class PurchasedByCustomer(Resource):
    def get(self, customer_id):
        item_purchased = Order.query.filter(Order.customer_id == customer_id).all() 
        if not item_purchased:
            return {'message': f'Customer with ID: {customer_id} has not bought any item'}, 200
        return [
            {
            'id': order.id,
            'quantity': order.quantity,
            'customer':{
                'username': order.customer.username,
            },
            'item': {
                'name': order.item.name,
                'price': order.item.price,
            }
             
        }for order in item_purchased
       
        ], 200  
    
# class FrequentBuyers(Resource):
#     def get(self, item_id):
#         orders = Order.query.filter(Order.item_id == item_id).all()

#         customer_count = Counter(order.customer_id for order in orders)
#         frequent_buyers = [
#             {
#                 'id': order.customer_id,
#                 'username': order.customer.username,
#                 'price': order.item.price,
#                 'times_purchased': customer_count[order.customer_id]
#             }
#             for order in orders if customer_count[order.customer_id] > 1
#         ]

#         if not frequent_buyers:
#             return {'message': 'No frequent customer found'}, 200
#         return frequent_buyers, 200

                   


class CustomerOrders(Resource):
    def get(self, customer_id):
        orders = Order.query.filter(Order.customer_id == customer_id).all()
        if not orders:
            return {'message': 'customer has no order'}, 200
        return [{
            'name': order.item.name,
            'price': order.item.price,
            'customer':{
                'username': order.customer.username

            }

        } for order in orders
        ], 200
    
    # Get All Items Ordered by a Specific Customer

class OrderItems(Resource):
    def get(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'customer is not logged in'}, 401
        orders = Order.query.filter(Order.customer_id == customer_id).all()
        return [
            {
                'quantity': order.quantity,
                'customer':{
                'username':order.customer.username,
                },
                'item': {
                    'name': order.item.name,
                    'price': order.item.price
                }

            }
            for order in orders
        ] , 200     
    
# Get All Customers Who Ordered a Specific Item
class CustomerGotAnItem(Resource):
    def get(self, item_id):
        orders = Order.query.filter(Order.item_id == item_id).all()
        if orders:
            return (
                [
                    {
                        'username': order.customer.username,
                        'email': order.customer.email,

                    }
                    for order in orders
                ], 200
            )


# Get Total Quantity Ordered for Each Item
class EachItemQuantity(Resource):
    def get(self):
        orders = Order.query.all()
        return (
            [
                {
                    'quantity': order.quantity,
                    'item': {
                        'name': order.item.name
                    }
                }
                for order in orders
            ], 200
        )

# Get Customers Who Have Not Ordered Anything
class CustomerWithNoOrder(Resource):
    def get(self):
        customers = Customer.query.filter(Customer.orders == []).all()
        return (
            [
                {
                    'username': customer.username,
                    'id': customer.id,

                }
                for customer in customers
            ], 200
            
        )
    
# Get Items with Orders Above a Certain Quantity
class OrdersMoreThanOne(Resource):
    def get(self):
        orders = Order.query.filter(Order.quantity > 1).all()
        return [
            {
                'quantity': order.quantity,
                'item': {
                    'name':order.item.name,
                    'price':order.item.price,
}
            }
            for order in orders
            ], 200
       
    
    # Get All Orders for an Item Ordered by a Specific Customer
class OrdersOfItemByACustomer(Resource):
    def get(self, item_id, customer_id):
        orders = Order.query.filter(Order.customer_id == customer_id, Order.item_id == item_id).all()
        return [
                {
                   'quantity': order.quantity,
                   'item': {
                       'name': order.item.name,
                       'price': order.item.price,

                   },
                   'customer': {
                       'username': order.customer.username
                   }
                }
                for order in orders
            ], 200
    
# # Get All Customers Who Ordered a Specific Item

class CustomersItem(Resource):
    def get(self, item_id):
        item = Item.query.filter(Item.id == item_id).first()
        if not item:
            return {'message': 'Item not found'}, 404

        customers = item.customers
        return [
            {
                
                'username': customer.username
            }
            for customer in customers
        ], 200
    

api.add_resource(CustomersItem, '/customers/<int:item_id>')
api.add_resource(OrdersOfItemByACustomer, '/items/<int:item_id>/<int:customer_id>')
 
api.add_resource(CustomerOrders, '/customers/orders/<int:customer_id>')               
# api.add_resource(FrequentBuyers, '/frequent_buyers/<int:item_id>')               
api.add_resource(ItemByCustomers, '/customers/item/<int:item_id>')               
api.add_resource(PurchasedByCustomer, '/items/customer/<int:customer_id>')               
############








api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Items, '/items')
api.add_resource(Logout, '/logout')
api.add_resource(ItemById, '/items/<int:item_id>')
api.add_resource(CustomerById, '/customer/<int:customer_id>')
api.add_resource(Cart, '/cart', '/cart/<int:order_id>')

api.add_resource(Checkout, '/checkout')

api.add_resource(EditOrder, '/cart/<int:order_id>')
api.add_resource(DeleteOrder, '/cart/<int:order_id>/delete')
api.add_resource(CreateItem, '/items')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

# python server/app.py
# sqlite3 /Users/layla/Development/code/se-prep/phase-4/EasyOrder/server/app.db


