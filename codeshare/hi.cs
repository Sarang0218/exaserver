using System.Collections;using System.Collections.Generic;using UnityEngine;using WebSocketSharp;using System;public class wsHost:MonoBehaviour
{public GameObject playermodel;WebSocket ws;public Dictionary<string,Vector3>userdata=new Dictionary<string,Vector3>();public Sendback sendback=new Sendback();[Serializable]
public class ud
{public string id;public Vector3 position;public GameObject player;}
public bool simulationSwitch=false;[SerializeField]
List<ud>userdataList=new List<ud>();private void Start()
{ws=new WebSocket("wss://exaserver-main.compilingcoder.repl.co/");ws.Connect();ws.Send("{\"K\":\"B\", \"1\":\"A\"}");ws.OnMessage=(sender,e)=>{string data=e.Data;jsoninfo Jsonres=JsonUtility.FromJson<jsoninfo>(data);string id=Jsonres.I;int animstate=Jsonres.A;float x=Jsonres.P[0];float y=Jsonres.P[1];float z=Jsonres.P[2];refreshPlayerset(id,new Vector3(x,y,z));simulationSwitch=true;};}
private void Update()
{if(ws==null)
{return;}
if(Input.GetKeyDown(KeyCode.Space))
{ws.Close();}
if(simulationSwitch)
{simulate();simulationSwitch=false;}}
void refreshPlayerset(string key,Vector3 v3){bool edit=false;for(int i=0;i<userdataList.Count;i){if(userdataList[i].id==key){userdataList[i].position=v3;edit=true;}}
if(!edit)
{userdataList.Add(new ud(){id=key,position=v3});}}
void simulate(){foreach(ud userinfo in userdataList){if(userinfo.player==null){GameObject playerinstance=Instantiate(playermodel,userinfo.position,Quaternion.identity);Debug.Log(playerinstance.name);playerinstance.name=userinfo.id;userinfo.player=playerinstance;}else{userinfo.player.transform.position=userinfo.position;}}
resendData();}
void resendData(){sendback.data=new List<Locdata>();foreach(ud userinfo in userdataList){Locdata locdata=new Locdata();locdata.id=userinfo.id;locdata.position=userinfo.position;sendback.data.Add(locdata);}
string message=JsonUtility.ToJson(sendback);Response res=new Response();res.data=message;res.K="G";string sender=JsonUtility.ToJson(res);ws.Send(sender);}
void OnApplicationQuit()
{ws.Close();}}
public class jsoninfo{public string I;public List<int>P;public int A;}
[Serializable]
public class Locdata{public string id;public Vector3 position;}
[Serializable]
public class Sendback{public List<Locdata>data;}
public class Response{public string K;public string data;}