from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

import ifcopenshell.api.root
import ifcopenshell.api.unit
import ifcopenshell.api.context
import ifcopenshell.api.project
import ifcopenshell.api.spatial
import ifcopenshell.api.geometry
import ifcopenshell.api.aggregate

from helpers import apology, login_required
import os
import sys
import shutil

from ifcFiles import ifcWall, ifcSlab1, ifcSlab2, ifcSlab3, ifcBeam1, ifcBeam2, ifcRoof, ifcColumn, ifcStair

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
# session deleted when browser quits
# content stored in server's files not in cookie itself, for privacy
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database - contains userID
db = SQL("sqlite:///miniifc.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
@login_required
def index():
    """Show IFC files"""
    # set session
    user_id = session["user_id"]
    
    all = db.execute("SELECT ifc_name, obj_name, user_id FROM ifcobj WHERE user_id = ?", user_id)
    
    return render_template("index.html", all=all)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        # validate form submission username, blank or if already exists in database
        username = request.form.get("username")
        if not username:
            # apology is the method which calls apology.html
            return apology("must provide username", 400)
        usernames = db.execute("SELECT username FROM users")
        for user in usernames:
            if user["username"] == username:
                return apology("username is already taken", 400)

        # validate form submission password
        password = request.form.get("password")
        if not password:
            return apology("must provide a password", 400)
        confirmation = request.form.get("confirmation")
        if not confirmation:
            return apology("must provide confirmation", 400)
        if password != confirmation:
            return apology("passwords do not match", 400)

        # make hash of users password
        hash = generate_password_hash(password)

        # add new row to users, username, hash to users table
        db.execute("INSERT INTO users (username, hash) VALUES (?,?)", username, hash)

        # once registered to login
        flash('Registered!')
        return render_template("login.html")

    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 400)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")  # getting, not posting to a form
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return redirect("/")


@app.route("/ifc", methods=["GET", "POST"])
@login_required
def ifc():
    """create ifc file"""
    #set session
    user_id = session["user_id"]

    if request.method == "POST":

        # user creates an ifc file 'Wall.ifc', 'Slab.ifc', 'Beam.ifc'
        ifc_name = request.form.get("dropdown")

        # if file_name exists in db issue alert 
        ifc_name = ifc_name + ".ifc"
        try:
            db.execute("INSERT INTO ifcobj (ifc_name, user_id) VALUES (?, ?)", ifc_name, user_id)
        except:
            # catch duplicates
            print("An exception occurred")
        
        ifc_name = ifc_name.replace(".ifc", "")

        function_map = {
            "Wall": ifcWall,
            "Slab1": ifcSlab1,
            "Slab2": ifcSlab2,
            "Slab3": ifcSlab3,
            "Beam1": ifcBeam1,
            "Beam2": ifcBeam2,
            "Roof": ifcRoof,
            "Column": ifcColumn,
            "Stair": ifcStair
        }

        file = function_map[ifc_name]()

        ifc_name = ifc_name.replace("ifc", "")
        
        file.write("ifc_files/" + ifc_name + ".ifc")
        #file.write("ifc_files/" + ifc_name + ".txt")
    
        return redirect ("/")

    else:

        return render_template("ifc.html")


@app.route("/spf", methods=["GET", "POST"])
@login_required
def spf():
    """create and view STEP PF"""

    if request.method == "POST":

        # user creates an ifc file 'Wall.ifc', 'Pipe.ifc', 'Plate.ifc'
        ifc_name = request.form.get("dropdown")
                      
        if ifc_name == "Wall":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
                            
        elif ifc_name == "Slab1":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
            
        elif ifc_name == "Slab2":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
            
        elif ifc_name == "Slab3":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
            
        elif ifc_name == "Column":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)            
        
        elif ifc_name == "Beam1":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
            
        elif ifc_name == "Beam2":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)
            
        elif ifc_name == "Roof":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)

        elif ifc_name == "Stair":

            with open("ifc_files/" + ifc_name + ".ifc", 'r') as file:
                lines = file.readlines()
                return render_template("ascii.html", lines=lines)                      

    else:
            return render_template("spf.html")


#@app.route("/sql", methods=["GET", "POST"])
#@login_required
#def sql():
    #"""create sql print out of IfcWall"""
    
    #return apology("TODO")
    # if request.method == "POST":

    # user creates obj file 'Wall.obj', 'Pipe.obj', 'Plate.obj'
    # ifc_name = request.form.get("dropdown")

    # convert ifc to sqlite3 and store in ifcfiles.db - can't use it??
    # os.system('cmd /c python -m ifcpatch -i "ifc_files/Wall.ifc" -o "ifcfiles.db" -r "Ifc2Sql" -a "sqlite"')


    #with open("ifc_files/Wall.txt", 'r') as file:
        #lines = file.readlines()

    #return render_template("sql.html")


@app.route("/obj", methods=["GET", "POST"])
@login_required
def obj():
    """create obj model"""

    #set session
    user_id = session["user_id"]
    print(user_id)

    #if post
    if request.method == "POST":

        # user creates an ifc file 'Wall.ifc', 'Pipe.ifc', 'Plate.ifc'
        ifc_name = request.form.get("dropdown")
        print(ifc_name)

        # 
        try:
            db.execute("UPDATE ifcobj SET obj_name = ? WHERE ifc_name = ? AND user_id = ?", ifc_name + ".obj", ifc_name + ".ifc", user_id)
        except: 
            print("An exception occurred") # catch duplicates
                      
        if ifc_name == "Wall":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Wall.obj"):
                os.remove("static/Wall.obj")
            
            if os.path.exists("static/Wall.mtl"):
                os.remove("static/Wall.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Wall.ifc" "static/Wall.obj"')

        if ifc_name == "Slab1":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Slab1.obj"):
                os.remove("static/Slab1.obj")
            
            if os.path.exists("static/Slab1.mtl"):
                os.remove("static/Slab1.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Slab1.ifc" "static/Slab1.obj"')

        if ifc_name == "Slab2":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Slab2.obj"):
                os.remove("static/Slab2.obj")
            
            if os.path.exists("static/Slab2.mtl"):
                os.remove("static/Slab2.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Slab2.ifc" "static/Slab2.obj"')

        if ifc_name == "Slab3":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Slab3.obj"):
                os.remove("static/Slab3.obj")
            
            if os.path.exists("static/Slab3.mtl"):
                os.remove("static/Slab3.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Slab3.ifc" "static/Slab3.obj"')

        if ifc_name == "Column":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Column.obj"):
                os.remove("static/Column.obj")
            
            if os.path.exists("static/Column.mtl"):
                os.remove("static/Column.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Column.ifc" "static/Column.obj"')

        if ifc_name == "Beam1":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Beam1.obj"):
                os.remove("static/Beam1.obj")
            
            if os.path.exists("static/Beam1.mtl"):
                os.remove("static/Beam1.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Beam1.ifc" "static/Beam1.obj"')

        if ifc_name == "Beam2":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Beam2.obj"):
                os.remove("static/Beam2.obj")
            
            if os.path.exists("static/Beam2.mtl"):
                os.remove("static/Beam2.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Beam2.ifc" "static/Beam2.obj"')

        if ifc_name == "Roof":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Roof.obj"):
                os.remove("static/Roof.obj")
            
            if os.path.exists("static/Roof.mtl"):
                os.remove("static/Roof.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Roof.ifc" "static/Roof.obj"')


        if ifc_name == "Stair":

            # if exists, delete or overwrite existing Wall.obj, Wall.mtl
            if os.path.exists("static/Stair.obj"):
                os.remove("static/Stair.obj")
            
            if os.path.exists("static/Stair.mtl"):
                os.remove("static/Stair.mtl")

            # convert ifc to obj
            os.system('cmd /c IfcConvert "ifc_files/Stair.ifc" "static/Stair.obj"')


        return redirect("/")
    
    
    else:

        return render_template("obj.html")


@app.route("/geo", methods=["GET", "POST"])
@login_required
def geo():
    """create and view GEOMETRY"""

    #set session
    user_id = session["user_id"]

    if request.method == "POST":

        # user creates ifc geometry 'Wall.obj', 'Slab1.obj', 'Slab2.obj', Roof.obj', 
        # 'Beam1.obj', 'Beam2.obj', 'Column.obj'
        request.form.get("Geometry")
        return render_template("render.html")
    
        # "wall.obj", "slab1.obj" etc.

        # objects that exist so far
        #obj_names = db.execute("SELECT obj_name FROM ifcobj WHERE user_id = ?", user_id)
        #print(obj_names)

        # print one object
        #if obj_name in obj_names["obj_name"]: #iterate?
            #return render_template("render.html") 
        # render all objects
        #for obj in obj_names:
            #if obj["obj_name"] == obj_name:
                #return render_template("render.html") # pass in value, obj_name "Wall.ifc"
            #else:
                #return render_template("geo.html")

        #for n in all_name:

            #if n == ifc_name:
            
                #return render_template("render.html")

        #elif ifc_name == "Wall":

            #return render_template("render.html")
                                  
        #elif ifc_name == "Slab1":

            #return render_template("render.html")
        
        #elif ifc_name == "Slab2":

            #return render_template("render.html")
        
        #elif ifc_name == "Slab3":

            #return render_template("render.html")
                  
        #elif ifc_name == "Beam1":

            #return render_template("render.html")
        
        #elif ifc_name == "Beam2":

            #return render_template("render.html")

        #elif ifc_name == "Column":

            #return render_template("render.html")
         
        #elif ifc_name == "Roof":

            #return render_template("render.html")
        
        #else: exit

    else:
            return render_template("geo.html")


#@app.route("/view", methods=["GET", "POST"])
#@login_required
#def view():
    #"""View IFC model"""

    #set session
    #user_id = session["user_id"] # for storing in dbase

    #return render_template("view.html")

@app.route("/store")
@login_required
def store():
    """Show files etc."""
    return apology("TODO")
    #return render_template("index.html")
