# miniIFC
#### Video Demo:  <URL HERE>
#### Description:
TODO

Description. 
miniIFC is a micro learning module to introduce the Industry Foundation Classes(IFC) to users in the Architecture, Engineering, Construction, and Operations (AECO) sector. IFC is the common language for the AECO sector which enables interoperability between applications. To create IFC models, the module uses the Python API bindings at  the core of the IfcOpenShell C++ system, an open source software library for software developers and Building Information Modelling (BIM) powerusers working with IFC.

> An IFC model is a collection of elements (e.g. doors, windows, construction tasks, materials, etc) with relationships to other elements in a graph-like database. Together, these elements and their relationships describe the digital built environment. Each element has a type known as an IFC Class. These classes define the attributes that the element may store. For example, the IfcWall Class is allowed to store a Name and Description attribute.This IFC database can be stored in many formats. The most common is the .ifc format, which stores data in plain text. [reference] (https://docs.ifcopenshell.org/introduction/introduction_to_ifc.html)

## REGISTER, LOGIN, LOGOUT, CHANGE PASSWORD

Functions are from CS50 Problem Set 9 'Finance'. SQL db [miniifc](/miniifc.db) table 'users' stores 'user name', 'id' and 'hash'. On succesful login the user is redirected to [index.html](/templates/index.html) and headings from [miniifc](/miniifc.db) table 'ifcobj' which are 'ifc', 'obj', and 'user_id'. The index keeps track of the user's progress through the micro learning module. On the index page, the navigation bar indicates options 'IFC', 'SPF', 'OBJ', 'GEO' which allow the user to create and view in various formats the IFC elements (wall, floors, roof, beams, columuns, stairs).

## CREATE IFC ELEMENT

IFC elements are created in [ifcfiles](/ifcfiles.py) which is imported by [app](/app.py). The elements include parameters for 'Placement' (4x4 matrix) and 'Representation' (length, width, thickness) which are opaque to the user. From [ifc.html](/templates/ifc.html) dropdown the user selects an IFC element and clicks the button 'Create IFC'. After checking for a duplicate name and id, the ifc_name and user_id are stored in [miniifc](/miniifc.db)  table 'ifcobj'.

'Write' is a method of ifcopenshell class [file](https://docs.ifcopenshell.org/autoapi/ifcopenshell/file/index.html) which writes a model to a file. In this case, the element or model is written as .ifc file which is stored in the repository folder [ifc_files](/ifc_files). The user is then redirected to [index](/templates/index.html) which confirms creation of the IFC element under the 'ifc' heading.

## CREATE SPF OF IFC ELEMENT

STEP Physical Format (SPF or IFC-SPF) is the most widely used format for IFC in practice. IFC-SPF is based on the ISO standard for clear text representation of EXPRESS data models ISO 10303-21. Clicking the 'SPF' tab in the navigation bar posts the user to [spf](/templates/spf.html) which allows selection of an element from the dropdown and a view of its IFC-SPF format. The button 'View' takes the user directly to the IFC-SPF file in ASCII (American Standard Code for Information Interchange) format where IFC classes for 'Header' and 'Data' are shown on each line. The .ifc file stored in ifc_files is opened and read by [ascii](/templates/ascii.html) and printed to the page row by row. For example, IFC classes for 'Placement' and 'Representation' respectively can be viewed for IfcWall as follows,
```
#24=IFCCARTESIANPOINTLIST2D(((0.,0.),(0.,300.),(5000.,300.),(5000.,0.),(0.,0.)));   length = 5m, thickness = 0.3m
#32=IFCEXTRUDEDAREASOLID(#27,#31,#26,4000.);                                        width = 4m
#36=IFCCARTESIANPOINT((-2000.,0.,-2000.));                                          coordinates x,y,z = (-2m,0m,-2m)
```
TODO. Expose to user input 'Placement' and 'Representation' parameters.

## CREATE OBJ FROM IFC ELEMENT

file convert ifc to obj

IfcConvert is a command-line application for converting IFC geometry into file formats such as OBJ, DAE, GLB, STP, IGS, XML, SVG, H5, and IFC itself.

## VIEW IFC GEOMETRY + PROPERTIES

WebGL2 is a javascript interface for rendering 2D and 3D graphics.

three.js is a framework for 3D content on the web.

>IfcPropertyDefinition captures dynamically extensible property sets. A property set contains one or more properties which may be a single value (e.g. string, number, unit measurement), a bounded value (having minimum and maximum), an enumeration, a list of values, a table of values, or a data structure. While IFC defines several hundred property sets for specific types, custom property sets may be defined by application vendors or end users.

>IfcPropertySet represents a set of properties attached to an object occurrence or object type. [reference](https://en.wikipedia.org/wiki/Industry_Foundation_Classes)