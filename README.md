**Application / Portal Overview**
=================================

The application was designed and created as a portal for customers to safely create accounts on the portal. Once an account is created, 
the user had the ability to make/create payments, by securely entering their payment/banking details; the user also has the ability to view 
their past payments made on the portal. In addition to the customers being able to make payments, employees now have the ability to verify all
pending transactions.

**Portal Features**
===================
1)	Account Registration
------------------------
A user is only given access to the payment history and payment portal through the secure login, using an account credentials. 
Thus, the portal allows for the user to create an account and stores the user’s details on the MongoDB. 
Error handling is done through means of Regex on the Registration page, for example, the page checks the length of a password, 
whether all compulsory fields have been completed and whether valid ID and account numbers have been provided. 

Employees are pre-registered and are not required to create an account; they are stored in a separate database than that of
the customer users. The seedEmployees.mjs servers as the seed action to register employee accounts, this is all for demonstration
purposes. In a real word cenario, a DB admin would be abe to add new employees credentials to the database.

2)	Login
---------
The user gains access to “their” portal by logging in with the credentials they registered with. 
The application searches the connected MongoDB for a match to the user’s entered details when login the user in; Regex is also used on 
this form for Error Handling.

The employees gains access to the "bank" portal by loggin in with their EmpoyeeID and password (which has been seeded).
The application searches the connected MongoDB for a match to the employees’s entered details when login the user in; Regex is also used on 
this form for Error Handling.

3)	Payment Viewing
--------------------
Once the user is logged in and directed to their portal, the page displays all their previous payments along with the details of the payment. 
When a user makes a payment, the details are stored on the Backend MongoDB, so when the payment page loads, the previous payments are retrieved 
from the MongoDB and displayed on their portal.

4)	Payment Creation
---------------------
Payment creation follow the structure of a basic form submission, however, the information being passed between pages makes use of a JWT token and 
the created SSL certificates and keys allow for the secure transfer of data. Once the user completes the form, the information is added to the MongoDB.


**Storage and Hosting**
=======================

The application is connected with a MongoDB to store all user information/details, as well as the payment details. This DB was created on a personal database, 
however the Virtual Machine IP address was whitelisted for this Cluster, allowing us to run and compile the application on the virtual machine directly. 
This Cluster serves as our backend Database storage for user and payment details, the frontend forms POST the details to the backend server, allowing us to add 
the details to the MongoDB. 

We’ve used our localhost for the backend server and MongoDB connection, as well as using the the localhost for the frontend. However, using PORT 3000 for, 
both, backend and frontend causes a slight conflict when the 2 need to communicate with each other. Thus, the 2 were initiated on 2 different ports, this 
allows them to seamlessly communicate with each other when using the GET and POST requests. 

**Security**
=============

The security of this application relies heavily on the OpenSSL certificate and key that was locally created for the application, this can be found in the 
“key” directory. This allows the application to transfer sensitive user information for the purpose of the application. 

The JWT token alos allows the pplication to pass the login details to the payment form, allowing the application to retrieve the associated payment 
information from the MongoDB on the backend/.

The token also controls access to certain features of the portal, when passing POST and GET requests from backend to frontend, the token specifies
the role of the user as "customer" or "employee". The employee does not have the ability to make payments and the customer does not have the ability to 
access and verify all payments.


**How to Run the Application**
==============================

1)	Go to the folder that says INSY7314_T2 
2)	Go inside the folder "backend"
3)	Right click and click "Open in terminal"
4)	In the terminal, type "node seedEmployees.mjs" and press enter
5)	In the terminal, type "node server.mjs" and press enter
6)	MINIMIZE the terminal (DONT CLOSE IT)
7)	Go in to the "frontend" folder
8)	Right click and click "Open in Terminal"
9)	In the terminal, type "npm start" and press enter
10)	Type Y
11)	The application will automatically start up in the default browser (Chrome – set in the frontend package.json file)

**YouTube Link**
================

https://www.youtube.com/watch?v=mK6Rseb702s&authuser=0

**GitHub Repository Link**
==========================

https://github.com/Rhian777/INSY7314_TASK3.git

**Declaration of the Usage of AI**
===================================

This declaration serves as an admittance to the usage of AI in assistance to the development of this application; ChatGPT was consulted when 
debugging certain errors or rewriting certiain code to prevent conflicts. Prompts run through ChatGPT include: "This is my Login.jsx code and this is
my employee.mjs code, please provide me with why the login is failing nd rewrite code to remove error [paste code]", "Why is the customer logins not working 
but the employee logs in work, below is my User.mjs code and Employee.mjs code, please help me remove the error [paste code]"

**Group Members**
=================

1)	Rhian Heralall - ST10247368 (Group Leader)
2)	Tyrese Hendricks - ST10070933
3)	Luqmaan Aziz - ST10038389
