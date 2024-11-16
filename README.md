# miniIFC
#### Video Demo:  <URL HERE>
#### Description:

miniIFC is a micro learning module to introduce the Industry Foundation Classes (IFC) to users in the Architecture, Engineering, Construction, and Operations (AECO) sector. IFC is the common language for the AECO sector which enables interoperability between applications. To create IFC models, the module uses Python API bindings at the core of the IfcOpenShell C++ system, an open source software library for software developers and Building Information Modelling (BIM) users working with IFC.

> An IFC model is a collection of elements (e.g. doors, windows, construction tasks, materials, etc) with relationships to other elements in a graph-like database. Together, these elements and their relationships describe the digital built environment. Each element has a type known as an IFC Class. These classes define the attributes that the element may store. For example, the IfcWall Class is allowed to store a Name and Description attribute.This IFC database can be stored in many formats and the most common is .ifc which stores data in plain text. [IfcOpenShell] (https://docs.ifcopenshell.org/introduction/introduction_to_ifc.html)

To contain each dependency's influence the repository 'CS50_FP_MINIIFC' is a Conda virtual environment 'miniifc'  within Visual Studio Code for Windows. It is also a git repository with commits pushed to [GitHub](https://github.com/RobMDoe/cs50-fp.git).

## REGISTER, LOGIN, LOGOUT, CHANGE PASSWORD

Functions are adapted from CS50 Problem Set 9 'Finance'. SQL db [miniifc.db](/miniifc.db) table 'users' stores 'user name', 'id' and 'hash'. On succesful login the user is redirected to [index.html](/templates/index.html) and headings from [miniifc.db](/miniifc.db) table 'ifcobj' which are 'ifc', 'obj', and 'user_id'. The index keeps track of the user's progress through the micro learning module. On the index page, the navigation bar indicates options 'IFC', 'SPF', 'OBJ', 'GEO' which allow the user to create and view in various formats the IFC elements (wall, floors, roof, beams, columuns, stairs).

## CREATE IFC ELEMENT

IFC elements are created in [ifcfiles](/ifcfiles.py) which is imported by [app.py](/app.py). The elements include parameters for 'Placement' (4x4 matrix) and 'Representation' (length, width, thickness) which are opaque to the user. From [ifc.html](/templates/ifc.html) dropdown the user selects an IFC element and clicks the button `Create IFC`. After checking for a duplicate name and id, the ifc_name and user_id are stored in [miniifc.db](/miniifc.db)  table 'ifcobj'.

`Write` is a method of ifcopenshell class [file](https://docs.ifcopenshell.org/autoapi/ifcopenshell/file/index.html) which writes a model to a file. In this case, the element or model is written as a .ifc file which is then stored in the repository folder [ifc_files](/ifc_files). The user is then redirected to [index.html](/templates/index.html) which confirms creation of the IFC element under the 'ifc' heading.

TODO.
- ifc_files is a temporary solution to store .ifc files. See notes on SQL below.

## CREATE SPF OF IFC ELEMENT

STEP Physical Format (SPF or IFC-SPF) is the most widely used format for IFC in practice. IFC-SPF is based on the ISO standard for clear text representation of EXPRESS data models ISO 10303-21. Clicking the `SPF` tab in the navigation bar posts the user to [spf.html](/templates/spf.html) which allows selection of an element from the dropdown and a view of its IFC-SPF format. The button `View` takes the user directly to the IFC-SPF file in ASCII (American Standard Code for Information Interchange) format where IFC classes for 'Header' and 'Data' are shown on each line. The .ifc file stored in '/ifc_files' is opened and read by [ascii.html](/templates/ascii.html) and printed to the page row by row. For example, IFC classes for 'Placement' and 'Representation' respectively can be viewed for IfcWall as follows,
```
#24=IFCCARTESIANPOINTLIST2D(((0.,0.),(0.,300.),(5000.,300.),(5000.,0.),(0.,0.)));   length = 5m, thickness = 0.3m
#32=IFCEXTRUDEDAREASOLID(#27,#31,#26,4000.);                                        width = 4m
#36=IFCCARTESIANPOINT((-2000.,0.,-2000.));                                          coordinates x,y,z = (-2m,0m,-2m)
```
TODO.
- Expose 'Placement' and 'Representation' parameters for user manipulation.

## CREATE SQL FROM IFC ELEMENT

TODO.
- Code included in app.py (commented out) using `ifcpatch` [ifc2SQL](https://docs.ifcopenshell.org/autoapi/ifcpatch/recipes/Ifc2Sql/index.html), a recipe from IfcOpenShell which converts an IFC-SPF model to SQLite. It creates an SQL database [ifcFiles.db](ifcFiles.db) with many tables for each IFC element.
- Ideally, SQL .db should store .ifc and .obj files for each user to allow querying and viewing based on id. But, patch recipe `ifc2SQL` is unwieldy, as noted above. Storing each users' .ifc in '/ifc_files' and .obj in '/static' folders in the repository is a temporary solution.
- Simplify database to include relevant tables and IFC elements for querying, viewing, etc.

## CREATE OBJ FROM IFC ELEMENT

OBJ file is an open format developed by [Wavefront Technologies](https://en.wikipedia.org/wiki/Wavefront_.obj_file). It is a simple data-format that represents 3D geometry - the position of each vertex, the UV position of each texture coordinate vertex, vertex normals, and the faces that make each polygon defined as a list of vertices, and texture vertices.

From [obj.html](/templates/obj.html) dropdown the user selects an OBJ element and clicks the button `Model OBJ`.  After checking for a duplicate name and id, the 'obj_name' and 'user_id' are stored in [miniifc.db](/miniifc.db) table 'ifcobj'. The OBJ file hasn't yet been created but it will need to be located in the '/static' folder so that it can be read by `OBJloader` in [render.js](/static/render.js) and viewed in a WebGL2 canvas. 

The 'ifc_name' is queried by the `def obj()` function in [app.py](/app.py). If its equivalent .obj and .mtl  (created for free - material properties) files already exist in the static folder then they are removed as they cannot be overwritten. The .ifc file needs to exist before it can be converted to a .obj and .mtl file using [IfcConvert](https://docs.ifcopenshell.org/ifcconvert.html), a command-line application by IfcOpenShell for converting IFC geometry into file formats such as OBJ, DAE, GLB, STP, IGS, XML, SVG, H5, and IFC. `IfcConvert` can only be used for elements such as a wall, floor or slab, not aggregated elements. Once the .obj is created the user is redirected to [index.html](/templates/index.html) which confirms creation of the OBJ element under the 'obj' heading. The .mtl file is not used by the `OBJloader` as it contains no data. Instead, materials are created separately using the [THREE.js](https://threejs.org/) JavaScript 3D library in [render.js](/static/render.js).

## VIEW IFC GEOMETRY + PROPERTIES

WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 3D and 2D graphics in a web browser without the use of plug-ins. It introduces an API that conforms to OpenGL ES 2.0 for use in HTML canvas elements. WebGL2 is based on OpenGL ES 3.0.

>Three.js is a cross-browser JavaScript library and application programming interface (API) used to create and display animated 3D computer graphics in a web browser using WebGL. [wikipedia](https://en.wikipedia.org/wiki/Three.js).

The user posts `Geometry` to [app.py](/app.py) function `def geo()` which calls [render.html](/templates/render.html) and runs [render.js](/static/render.js) as follows:

### Scene
1. [Render.html](/templates/render.html) returns an HTML canvas element which is initialised for the WebGL2 context.
2. Three.js renderer, perspective camera and scene are set up for 3D objects.
3. Three.js `labelRenderer` is set up for 2D text.
4. Three.js `OrbitControls` are set to allow user to navigate the scene using the mouse.
- End of scene set up.
### Geometry
6. Element (wall, floor...) variables are set.
7. Function `createMesh` is passed geometry, material, name, layer.
8. Materials are created.
9. `OBJloader` is instantiated.
10. Function `createWall` takes .obj file from '/static' folder.
11. Element object (wall, floor...) is added to a group.
- End of geometry set up.
### Labels
13. A paragraph container `CSS2DObject(pContainer)` is created for labels (text).
14. An unordered list is made to describe the object element's property set (reference, status, acoustic rating, fire rating...).

>>>The IfcPropertySet is a container that holds properties within a property tree. These properties are interpreted according to their name attribute. Each individual property has a significant name string. [IfcPropertySet](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifckernel/lexical/ifcpropertyset.htm)

### Raycaster
15. Three.js `Raycaster()` set up with `addEventListener` to log mouse 'click' position. Its intersection with a 3D element object allows a label (text) to be appended.
### Directional lights and plane
16. Three.js `DirectionalLight` and `PlaneGeometry` are set up and added to the scene.
### Animation
17. Animation allows the renderer to update as object elements and labels are navigated by orbit controls.

TODO.
- WebGL2 displays all .obj files that have been created by all users rather than by each user. Resolve this with SQL database, as noted above.

FUTURE.
- Create Computer Aided Design (CAD) user interface to allow conceptual architectural design (i.e. early stages) using IFC elements.
- Dynamically add IFCPropertySet data to ensure conceptual design is foundation for development of IFC data.
- Create parametric relationships enabling user to manipulate IFC element properties.