import mysql.connector
from mysql.connector import errorcode
import bcrypt

# --- Database Configuration ---
DB_CONFIG = {
    'user': 'your_mysql_user',
    'password': 'your_mysql_password',
    'host': '127.0.0.1',
    'database': 'my_website_db'
}

# --- Helper Functions (no changes here) ---
def hash_password(password):
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt)

def check_password(plain_password, hashed_password):
    password_bytes = plain_password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password_bytes)

# --- Database Interaction Functions (MODIFIED) ---

def create_user(username, password):
    """Creates a new user. Returns True on success, False on failure."""
    try:
        hashed_pwd = hash_password(password)
        cnx = mysql.connector.connect(**DB_CONFIG)
        cursor = cnx.cursor()
        add_user_query = ("INSERT INTO users (username, password_hash) VALUES (%s, %s)")
        user_data = (username, hashed_pwd)
        cursor.execute(add_user_query, user_data)
        cnx.commit()
        return True # Return True for success
    except mysql.connector.Error as err:
        # We can still print server-side errors for debugging
        print(f"Database Error in create_user: {err}")
        return False # Return False on any error
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cursor.close()
            cnx.close()

def delete_user(username):
    """Deletes a user. Returns True on success, False if user not found."""
    try:
        cnx = mysql.connector.connect(**DB_CONFIG)
        cursor = cnx.cursor()
        delete_user_query = "DELETE FROM users WHERE username = %s"
        cursor.execute(delete_user_query, (username,))
        cnx.commit()
        # Return True if a row was actually deleted
        return cursor.rowcount > 0
    except mysql.connector.Error as err:
        print(f"Database Error in delete_user: {err}")
        return False
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cursor.close()
            cnx.close()

def login_user(username, password):
    """Authenticates a user. Returns True on success, False on failure."""
    try:
        cnx = mysql.connector.connect(**DB_CONFIG)
        cursor = cnx.cursor(dictionary=True) # dictionary=True is useful
        get_user_query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(get_user_query, (username,))
        user_data = cursor.fetchone()

        if user_data is None:
            return False # User not found

        stored_hashed_password = user_data['password_hash']
        
        # check_password needs the stored hash as bytes
        if check_password(password, stored_hashed_password.encode('utf-8')):
            return True # Password matches
        else:
            return False # Password does not match
    except mysql.connector.Error as err:
        print(f"Database Error in login_user: {err}")
        return False
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cursor.close()
            cnx.close()