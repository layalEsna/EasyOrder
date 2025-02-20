
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship


import re


from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})


db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()



# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_only = ('id', 'username', 'email')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    _hash_password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    is_seller = db.Column(db.Boolean, default=False)

    items = association_proxy('orders', 'item')
    orders = db.relationship('Order', back_populates='customer')

    @validates('username')
    def validate_username(self,key, username):
        if not username or not isinstance(username, str):
            raise ValueError('username is required and must be a string.')
        if len(username) < 5 or len(username) > 100:
            raise ValueError('Username must be between 5 and 100 characters inclusive.')
        return username
    
    @property
    def password(self):
        raise ArithmeticError('password is read only')
    
    @password.setter
    def password(self, password):
        pattern = re.compile(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$')
        if not password or not isinstance(password, str):
            raise ValueError('password is required and must be a string')
        if not pattern.match(password):
            raise ValueError('password must be at least 8 characters and includes at least one upper case, one lower case letter and one symbol')
        self._hash_password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._hash_password, password)

    
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
    


    customers = association_proxy('orders', 'customer')
    orders = db.relationship('Order', back_populates='item')

    

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
    serialize_only = ('id', 'customer_id', 'item_id', 'quantity', 'item.name', 'item.price')

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