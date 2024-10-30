import ifcopenshell.api.root
import ifcopenshell.api.unit
import ifcopenshell.api.context
import ifcopenshell.api.project
import ifcopenshell.api.spatial
import ifcopenshell.api.geometry
import ifcopenshell.api.aggregate

import ifcopenshell.util
import ifcopenshell.util.placement
import numpy

def ifcWall():

    # Create a blank model
    file = ifcopenshell.api.project.create_file()

    # All projects must have one IFC Project element
    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")
    # Geometry is optional in IFC, but because we want to use geometry in this example, let's define units
    # Assigning without arguments defaults to metric units
    ifcopenshell.api.unit.assign_unit(file)
    # Let's create a modeling geometry context, so we can store 3D geometry (note: IFC supports 2D too!)
    context = ifcopenshell.api.context.add_context(file, context_type="Model")
    # In particular, in this example we want to store the 3D "body" geometry of objects, i.e. the body shape
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)
    # Create a site, building, and storey. Many hierarchies are possible.
    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")
    # Since the site is our top level location, assign it to the project
    # Then place our building on the site, and our storey in the building
    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])
    # Let's create a new wall
    wall = ifcopenshell.api.root.create_entity(file, ifc_class="IfcWall")

    # Object placement
    # Translate
        # XAxis_X, YAxis_X, ZAxis_X, X
        # XAxis_Y, YAxis_Y, ZAxis_Y, Y
        # XAxis_Z, YAxis_Z, ZAxis_Z, Z
        # 0,       0,       0,       1
    matrix = numpy.eye(4)
    # Rotate around Z axis first
    matrix = ifcopenshell.util.placement.rotation(90, "Z") @ matrix
    matrix[:,3][0:3] = (-2.0, 0.0,-2.0)
        # Matrix changed like this
        # 0, -1, 0, n
        # 1,  0, 0, n
        # 0,  0, 1, n
        # 0,  0, 0, 1
    ifcopenshell.api.geometry.edit_object_placement(file, product=wall, matrix=matrix, is_si=True)
    # Add a new wall-like body geometry
    representation = ifcopenshell.api.geometry.add_wall_representation(file, context=body, length=5, height=4, thickness=0.3)
    # Assign our new body geometry back to our wall
    ifcopenshell.api.geometry.assign_representation(file, product=wall, representation=representation)
    # Place our wall in the ground floor
    ifcopenshell.api.spatial.assign_container(file, products=[wall], relating_structure=storey)

    return file


def ifcSlab1():

    #LEVEL 1 FLOOR BUILD-UP

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    # Let's create a new slab
    slab = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSlab")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "X") @ matrix
    matrix[:,3][0:3] = (-0.075, 0.4, 0.0)

    ifcopenshell.api.geometry.edit_object_placement(file, product=slab, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="3850x4000", ProfileType="AREA", XDim=3850, YDim=4000)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=0.1)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=slab, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[slab], relating_structure=storey)

    return file


def ifcSlab2():

    #LEVEL 2 FLOOR BUILD-UP

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    slab = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSlab")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "X") @ matrix
    matrix[:,3][0:3] = (-.075, 2.9, 0.5)

    ifcopenshell.api.geometry.edit_object_placement(file, product=slab, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="3800x3000", ProfileType="AREA", XDim=3850, YDim=3000)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=0.1)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=slab, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[slab], relating_structure=storey)

    return file

def ifcSlab3():

    #LEVEL 2 LANDING

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    slab = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSlab")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "X") @ matrix
    matrix[:,3][0:3] = (1.40, 2.9, -1.425)

    ifcopenshell.api.geometry.edit_object_placement(file, product=slab, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="900x900", ProfileType="AREA", XDim=900, YDim=900)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=0.1)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=slab, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[slab], relating_structure=storey)

    return file

def ifcColumn():

    # Columns

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    column = ifcopenshell.api.root.create_entity(file, ifc_class="IfcColumn")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "X") @ matrix
    matrix[:,3][0:3] = (0, 5.2, 0)

    ifcopenshell.api.geometry.edit_object_placement(file, product=column, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="150x150", ProfileType="AREA", XDim=150, YDim=150)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=5.2)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=column, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[column], relating_structure=storey)

    return file

def ifcBeam1():

    # ROOF BEAM

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    beam1 = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBeam")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "Y") @ matrix
    matrix[:,3][0:3] = (-2.3, 5.1, 0.0)

    ifcopenshell.api.geometry.edit_object_placement(file, product=beam1, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="100x200", ProfileType="AREA", XDim=100, YDim=200)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=4.15)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=beam1, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[beam1], relating_structure=storey)

    return file

def ifcBeam2():

    # FLOOR BEAM

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    beam2 = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBeam")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "Y") @ matrix
    matrix[:,3][0:3] = (-2.0, 0.2, 0.0)

    ifcopenshell.api.geometry.edit_object_placement(file, product=beam2, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="100x200", ProfileType="AREA", XDim=100, YDim=200)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=3.85)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=beam2, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[beam2], relating_structure=storey)

    return file


def ifcRoof():

    # ROOF BUILD UP

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    roof = ifcopenshell.api.root.create_entity(file, ifc_class="IfcRoof")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(90, "X") @ matrix
    # Slope of roof, keep level?
    #matrix = ifcopenshell.util.placement.rotation(-10,"Z") @ matrix
    matrix[:,3][0:3] = (0, 5.3, 0)

    ifcopenshell.api.geometry.edit_object_placement(file, product=roof, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="4000x4000", ProfileType="AREA", XDim=4000, YDim=4000)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=0.1)
  
    ifcopenshell.api.geometry.assign_representation(file, product=roof, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[roof], relating_structure=storey)

    return file

def ifcStair():

    # STAIR GOING PROFILE

    file = ifcopenshell.api.project.create_file()

    project = ifcopenshell.api.root.create_entity(file, ifc_class="IfcProject", name="My Project")

    ifcopenshell.api.unit.assign_unit(file)

    context = ifcopenshell.api.context.add_context(file, context_type="Model")

    # REPRESENTATION CONTEXT
    body = ifcopenshell.api.context.add_context(file, context_type="Model",
        context_identifier="Body", target_view="MODEL_VIEW", parent=context)

    site = ifcopenshell.api.root.create_entity(file, ifc_class="IfcSite", name="My Site")
    building = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuilding", name="Building A")
    storey = ifcopenshell.api.root.create_entity(file, ifc_class="IfcBuildingStorey", name="Ground Floor")

    ifcopenshell.api.aggregate.assign_object(file, relating_object=project, products=[site])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=site, products=[building])
    ifcopenshell.api.aggregate.assign_object(file, relating_object=building, products=[storey])

    stair = ifcopenshell.api.root.create_entity(file, ifc_class="IfcStair")

    # PLACEMENT
    matrix = numpy.eye(4)
    matrix = ifcopenshell.util.placement.rotation(0, "X") @ matrix
    matrix[:,3][0:3] = (-1.2, 0.0, -1.90)

    ifcopenshell.api.geometry.edit_object_placement(file, product=stair, matrix=matrix, is_si=True)

    # REPRESENTATION
    profile = file.create_entity("IfcRectangleProfileDef", ProfileName="100x200", ProfileType="AREA", XDim=250, YDim=75)
    representation = ifcopenshell.api.geometry.add_profile_representation(file, context=body, profile=profile, depth=0.90)
    
    # ASSIGN REPRESENTATION BACK 
    ifcopenshell.api.geometry.assign_representation(file, product=stair, representation=representation)

    ifcopenshell.api.spatial.assign_container(file, products=[stair], relating_structure=storey)

    return file