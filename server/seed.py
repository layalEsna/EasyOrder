#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Customer, Item, Order

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        db.drop_all()
        db.create_all()

        # Seed Customers
        customer1 = Customer(username='Lunaxx', email=fake.email(),)
        customer1.password = 'Ddddddddd!'

        customer2 = Customer(username='Darya', email=fake.email(),)
        customer2.password = 'Ddddddddd!'

        customer3 = Customer(username='Pardis', email=fake.email(),)
        customer3.password = 'Ddddddddd!'

        customer4 = Customer(username='Arshia', email=fake.email(),)
        customer4.password = 'Ddddddddd!'

        db.session.add(customer1)
        db.session.add(customer2)
        db.session.add(customer3)
        db.session.add(customer4)
        db.session.commit()

        # Seed Items (Add each item only once)
        item1 = Item(name='Laptop', price=randint(500, 2000))
        item2 = Item(name='Smartphone', price=randint(100, 1500))
        item3 = Item(name='Headphones', price=randint(50, 300))
        item4 = Item(name='Smartwatch', price=randint(100, 800))

        db.session.add(item1)
        db.session.add(item2)
        db.session.add(item3)
        db.session.add(item4)
        db.session.commit()

        # If you want to create orders, use `Order` model here

        print("Seeding complete!")


        # Seed Orders
        # order1 = Order(
        #     customer_id=customer1.id,
        #     item_id=item1.id,
        #     quantity=randint(1, 5)
        # )
        # order2 = Order(
        #     customer_id=customer2.id,
        #     item_id=item2.id,
        #     quantity=randint(1, 3)
        # )
        # order3 = Order(
        #     customer_id=customer3.id,
        #     item_id=item3.id,
        #     quantity=randint(1, 4)
        # )
        # order4 = Order(
        #     customer_id=customer1.id,
        #     item_id=item4.id,
        #     quantity=randint(1, 2)
        # )
        # db.session.add(order1)
        # db.session.add(order2)
        # db.session.add(order3)
        # db.session.add(order4)
        # db.session.commit()

        print("Seeding complete!")
