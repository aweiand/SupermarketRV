//http://answers.unity3d.com/questions/31658/picking-upholding-objects.html
#pragma strict

var normalCollisionCount = 1;
var spring = 50.0;
var damper = 5.0;
var drag = 10.0;
var angularDrag = 5.0;
var distance = 0.2;
var throwForce = 500;
var throwRange = 1000;
var attachToCenterOfMass = false;
 
private var springJoint : SpringJoint;
 
function Update (){
	if (Input.GetKey(KeyCode.E)){
		raiseObject();
	}
	
	if (Input.GetKey(KeyCode.R)){
		reduceObject();
	}	

	if (Input.GetKeyDown(KeyCode.N)){
		getObjectName();
	}
	if (Input.GetKeyUp(KeyCode.N)){
		Str = "";
	}	
			
    // Make sure the user pressed the mouse down
    if (!Input.GetMouseButtonDown (0))
        return;
  
    var mainCamera = FindCamera();
 
    // We need to actually hit an object
    var hit : RaycastHit;
    if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100))
        return;
    // We need to hit a rigidbody that is not kinematic
    if (!hit.rigidbody || hit.rigidbody.isKinematic)
        return;
 
    if (!springJoint){
        var go = new GameObject("Rigidbody dragger");
        var body : Rigidbody = go.AddComponent ("Rigidbody") as Rigidbody;
        springJoint = go.AddComponent ("SpringJoint");
        body.isKinematic = true;
    }
 
    springJoint.transform.position = hit.point;
    if (attachToCenterOfMass){
        var anchor = transform.TransformDirection(hit.rigidbody.centerOfMass) + hit.rigidbody.transform.position;
        anchor = springJoint.transform.InverseTransformPoint(anchor);
        springJoint.anchor = anchor;
    } else {
        springJoint.anchor = Vector3.zero;
    }
 
    springJoint.spring = spring;
    springJoint.damper = damper;
    springJoint.maxDistance = distance;
    springJoint.connectedBody = hit.rigidbody;
 
    StartCoroutine ("DragObject", hit.distance);
}
 
function DragObject (distance : float){
    var oldDrag = springJoint.connectedBody.drag;
    var oldAngularDrag = springJoint.connectedBody.angularDrag;
    springJoint.connectedBody.drag = drag;
    springJoint.connectedBody.angularDrag = angularDrag;
    var mainCamera = FindCamera();
    while (Input.GetMouseButton (0)){
        var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
        springJoint.transform.position = ray.GetPoint(distance);
        yield;
 
        if (Input.GetMouseButton (1)){
            springJoint.connectedBody.AddExplosionForce(throwForce,mainCamera.transform.position,throwRange);
            springJoint.connectedBody.drag = oldDrag;
            springJoint.connectedBody.angularDrag = oldAngularDrag;
            springJoint.connectedBody = null;
        }
    }
    if (springJoint.connectedBody){
        springJoint.connectedBody.drag = oldDrag;
        springJoint.connectedBody.angularDrag = oldAngularDrag;
        springJoint.connectedBody = null;
    }
}
 
function FindCamera (){
    if (camera)
        return camera;
    else
        return Camera.main;
}

function raiseObject(){
	var _mainCamera = FindCamera();

	// We need to actually hit an object
	var _hit : RaycastHit;
	if (!Physics.Raycast(_mainCamera.ScreenPointToRay(Input.mousePosition),  _hit, 100))
		return;
	// We need to hit a rigidbody that is not kinematic
	if (!_hit.rigidbody || _hit.rigidbody.isKinematic)
		return;
		
	_hit.transform.localScale.x = _hit.transform.localScale.x + 0.1;
	_hit.transform.localScale.y = _hit.transform.localScale.y + 0.1;
	_hit.transform.localScale.z = _hit.transform.localScale.z + 0.1;

	return;
}

function reduceObject(){
	var mainCamera = FindCamera();

	// We need to actually hit an object
	var hit : RaycastHit;
	if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100))
		return;
	// We need to hit a rigidbody that is not kinematic
	if (!hit.rigidbody || hit.rigidbody.isKinematic)
		return;
		
	hit.transform.localScale.x = hit.transform.localScale.x - 0.1;
	hit.transform.localScale.y = hit.transform.localScale.y - 0.1;
	hit.transform.localScale.z = hit.transform.localScale.z - 0.1;

	return;
}

function getObjectName(){
	var mainCamera = FindCamera();

	// We need to actually hit an object
	var hit : RaycastHit;
	if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100))
		return;
	// We need to hit a rigidbody that is not kinematic
	if (!hit.rigidbody || hit.rigidbody.isKinematic)
		return;

	Str = "Object Name: " + hit.rigidbody.name + "\n" +
		  " Scale X: " + hit.rigidbody.transform.localScale.x + "\n" +
		  " Scale Y: " + hit.rigidbody.transform.localScale.y + "\n" +
		  " Scale Z: " + hit.rigidbody.transform.localScale.z + "\n";
		
	return;
}

var Str : String;
 
function OnGUI(){
	GUI.Label (Rect (Screen.width/2,Screen.height/2,Screen.width/2,Screen.height/2), Str);
}