
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db



# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_only = ('id', 'name', 'email')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

   
    orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')
class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'
    serialize_only = ('id', 'name', 'price')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

   
    orders = db.relationship('Order', back_populates='item', cascade='all, delete-orphan')

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    serialize_only = ('id', 'customer_id', 'item_id', 'quantity')

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)

    customer = db.relationship('Customer', back_populates='orders')
    item = db.relationship('Item', back_populates='orders')
