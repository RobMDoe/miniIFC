# miniIFC
#### Video Demo:  <URL HERE>
#### Description:
TODO

> An IFC model is a collection of elements (e.g. doors, windows, construction tasks, materials, etc) with relationships to other elements in a graph-like database. Together, these elements and their relationships describe the digital built environment. Each element has a type known as an IFC Class. These classes define the attributes that the element may store. For example, the IfcWall Class is allowed to store a Name and Description attribute.This IFC database can be stored in many formats. The most common is the .ifc format, which stores data in plain text. (Source: https://docs.ifcopenshell.org/introduction/introduction_to_ifc.html)

Description. 
miniIFC is a micro learning app to introduce users in the Architecture, Engineering, Construction, Operations (AECO) sector to the Industry Foundation Class (IFC) and to provide a conceptual design environment.

IFC is the common language for the AECO sector enabling interoperability between applications.

## REGISTER, LOGIN, LOGOUT

Based on CS50 Finance

## CREATE IFC ELEMENT

app.py imports IFC files from ifcfiles.py

user selects building element to create IFC file.

file.write saves IFC file to ifc_files folder

### IfcOpenShell api

Uses Python bindings to the core IfcOpenShell C++ system.

ifcopenshell.api.project.create_file() to create a new IFC.

### write file (recipe)

A method of the class ifcopenshell.file.

>write(path: os.PathLike | str, format: str | None = None, zipped: bool = False) → None

>Write ifc model to file.

>:param format: Force use of a specific format. Guessed from file name

    if None. Supported formats : .ifc, .ifcXML, .ifcZIP (equivalent to format=”.ifc” with zipped=True) For zipped .ifcXML use format=”.ifcXML” with zipped=True

>:param zipped: zip the file after it is written :type zipped: bool

>Example:

>model.write("path/to/model.ifc")

From app.py,

file.write("ifc_files/" + ifc_name + ".ifc")

## CREATE SPF OF IFC ELEMENT

Create a new IFC4 model, then save it to an IFC-SPF file.

### View in ASCII format

### TODO. Manipulate parameters - width, height, thickness, properties.

## CREATE OBJ FROM IFC ELEMENT

file convert ifc to obj

IfcConvert is a command-line application for converting IFC geometry into file formats such as OBJ, DAE, GLB, STP, IGS, XML, SVG, H5, and IFC itself.

## VIEW GEOMETRY + PROPERTIES

WebGL2 is a javascript interface for rendering 2D and 3D graphics.

three.js is a framework for 3D content on the web.