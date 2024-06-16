import requests

# Base URL of the API
BASE_URL = 'https://lascadehost.onrender.com/api'

# Endpoints
REGISTER_URL = f'{BASE_URL}/auth/register'
LOGIN_URL = f'{BASE_URL}/auth/login'
UPLOAD_URL = f'{BASE_URL}/files/upload'

# User details for registration and login
user_details = {
    'username': 'testuser',
    'password': 'password123'
}

# Register the user
def register_user():
    response = requests.post(REGISTER_URL, json=user_details)
    if response.status_code == 201:
        print('User registered successfully')
    else:
        print('User registration failed:', response.json())

# Login the user and get the token
def login_user():
    response = requests.post(LOGIN_URL, json=user_details)
    if response.status_code == 200:
        token = response.json().get('token')
        print('User logged in successfully')
        return token
    else:
        print('Login failed:', response.json())
        return None

# Upload a CSV file
def upload_csv(token, file_path):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    files = {
        'file': open(file_path, 'rb')
    }
    response = requests.post(UPLOAD_URL, headers=headers, files=files)
    if response.status_code == 200:
        print('File uploaded successfully:', response.json())
    else:
        print('File upload failed:', response.json())


token = None


while True:
    choice = input("1. Register\n2. Login\n3. Upload\n4. Exit\nEnter your choice: ")
    if choice == '1':
        register_user()
    elif choice == '2':
        token = login_user()
        print(token)
    elif choice == '3':
        if token:
            csv_file_path = "users.csv"
            upload_csv(token, csv_file_path)
        else:
            print('Please login first')
    elif choice == '4':
        break
    else:
        print('Invalid choice')