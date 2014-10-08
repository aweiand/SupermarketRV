//https://www.mvcodeclub.com/lessons/pegando-up-throwing-and-dropping-objects-in-unity
#pragma strict

var objectPos : Vector3;
var objectRot : Quaternion;
var pickObj : GameObject;
var pode_pegar = true;
var pegando = false;
var guipick = false;
var pickref : GameObject;

function Start () {
	pickref = GameObject.FindWithTag("pickup");
	pickObj = pickref;
}

function Update () {
	// Para usar com a transformaçao do objeto
	var x; var y; var z;
	
	var raycheck: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var hitcheck: RaycastHit;

	if (Physics.Raycast(raycheck, hitcheck,10) && hitcheck.collider.gameObject.tag == "pickup"){
		guipick = true;
	}
	
	if (Physics.Raycast(raycheck, hitcheck) && hitcheck.collider.gameObject.tag != "pickup"){
		guipick = false;
	}

	objectPos = transform.position;
	objectRot = transform.rotation;

	// Clique ESQUERDO do mouse
	if(Input.GetMouseButtonDown(0) && pode_pegar){
		pegando = true;

		var ray: Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit: RaycastHit;

		if (Physics.Raycast(ray, hit, 10) && hit.collider.gameObject.tag == "pickup"){
			pickObj = hit.collider.gameObject;
			hit.rigidbody.useGravity = false;
			hit.rigidbody.isKinematic = true;
			hit.collider.isTrigger = true;

			hit.transform.parent = gameObject.transform;
			hit.transform.position = objectPos;
			hit.transform.rotation = objectRot;
		}
	}

	// Clique ESQUERDO do mouse
	if(Input.GetMouseButtonUp(0) && pegando){
		pegando = false;
		pode_pegar = false;
	}

	// Clique ESQUERDO do mouse
	if(Input.GetMouseButtonDown(0) && !pode_pegar  && pickObj.GetComponent(pickedupobj).refusethrow != true){
		
		pode_pegar = true;
	
		pickObj.rigidbody.useGravity = true;
		pickObj.rigidbody.isKinematic = false;
		pickObj.transform.parent = null;
		pickObj.collider.isTrigger = false;
		pickObj.rigidbody.AddForce (transform.forward * 500);
		pickObj = pickref;
	}

	// Clique DIREITO do mouse
	if(Input.GetMouseButtonDown(1) && !pode_pegar  && pickObj.GetComponent(pickedupobj).refusethrow != true){
		pode_pegar = true;

		pickObj.rigidbody.useGravity = true;
		pickObj.rigidbody.isKinematic = false;
		pickObj.transform.parent = null;
		pickObj.collider.isTrigger = false;
		pickObj = pickref;
	}
	
	if(Input.GetKey (KeyCode.E) && !pode_pegar  && pickObj.GetComponent(pickedupobj).refusethrow != true) {
		x = pickref.transform.localScale.x = pickref.transform.localScale.x + 0.01;
		y = pickref.transform.localScale.y = pickref.transform.localScale.y + 0.01;
		z = pickref.transform.localScale.z = pickref.transform.localScale.z + 0.01;
		pickref.transform.localScale = new Vector3(x,y,z);
	}

	if(Input.GetKey (KeyCode.R) && !pode_pegar  && pickObj.GetComponent(pickedupobj).refusethrow != true) {
		x = pickref.transform.localScale.x = pickref.transform.localScale.x -0.01;
		y = pickref.transform.localScale.y = pickref.transform.localScale.y -0.01;
		z = pickref.transform.localScale.z = pickref.transform.localScale.z -0.01;
		pickref.transform.localScale = new Vector3(x,y,z);
	}	
}


function OnGUI () {
	GUI.Label (Rect (Screen.width/2,Screen.height/2.1,Screen.width/2,Screen.height/2), "X");

	if (guipick && pode_pegar){
		GUI.Label (Rect (Screen.width/2,Screen.height/2,Screen.width/2,Screen.height/2), "Pegue");
		GUI.Label (Rect (Screen.width/3,Screen.height/3,Screen.width/3,Screen.height/3), pickref.name);
	}
}