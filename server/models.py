
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship

import re

from config import db



# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_only = ('id', 'name', 'email')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    @validates('name')
    def validate_name(self,key, name):
        if not name or not isinstance(name, str):
            raise ValueError('Name is required and must be a string.')
        if len(name) < 5 or len(name) > 100:
            raise ValueError('Name must be between 5 and 100 characters inclusive.')
        return name
    
    @validates('email')
    def validate_email(self,key, email):
        if not email or not isinstance(email, str):
            raise ValueError('Email is required and must be a string.')
        if len(email) < 10 or len(email) > 100:
            raise ValueError('Email must be between 10 and 100 characters inclusive.')
        email_reg = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_reg, email):
            raise ValueError('Invalid email format.')
        return email


   
    orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')
class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'
    serialize_only = ('id', 'name', 'price')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

    @validates('name')
    def validate_name(self,key, name):
        if not name or not isinstance(name, str):
            raise ValueError('Name is required and must be a string.')
        if len(name) < 5 or len(name) > 100:
            raise ValueError('Name must be between 5 and 100 characters inclusive.')
        return name


    @validates('price')
    def validate_price (self, key, price ):
        if not price or not isinstance(price, (int, float)) or price <= 0:
            raise ValueError('Price must be a positive number (int, float, or Decimal).')
        return price 

   
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

    @validates('quantity')
    def validate_quantity(self, key, quantity):
        if not isinstance(quantity, int) or quantity < 1:
            raise ValueError('Quantity is required and must be a positive integer.')
        return quantity

# 