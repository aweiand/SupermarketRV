//https://www.mvcodeclub.com/lessons/picking-up-throwing-and-dropping-objects-in-unity
#pragma strict

var refusethrow = false;

function Start () {
}

function Update () {

}

function OnTriggerEnter (other : Collider) {
	if (other.gameObject.tag != "player" && other.gameObject.tag != "pickto"){ 
		refusethrow = false;
	}
}

function OnTriggerExit (other : Collider) {
	if (other.gameObject.tag != "player" && other.gameObject.tag != "pickto"){ 
		refusethrow = true;
	}
}