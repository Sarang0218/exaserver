
const { Worker, workerData, isMainThread, parentPort } =  require('worker_threads');
function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

var QUEUE = [];
parentPort.on('message', ({task, conns})=>{
    magic = conns
    QUEUE.push(task);
    for (var i=0; i<QUEUE.length; i++) {
      parentPort.postMessage(calculateRC(QUEUE[i]));
      removeItemOnce(QUEUE, QUEUE[i])
    }
})


function calculateRC(task) {
  try {
    data = JSON.parse(task);  
  } catch {
    data = JSON.parse('{"K":"FAILED JSON PARSING", "0":"PLEASE_NO_ERROR!", "1":"FAILSAFE!"}')
  }
  
  header = data["K"];
  switch (header) {
    case "0":
      break;
    case "1":
      
  }  
  
  return "tesr"
}

//   console.log('received: %s from %s', message, ws.serverset);
  //   n = message.toString()
  //   refreshServersets()

  //   try {
  //     data = JSON.parse(n);
  //   } catch {
  //     data = JSON.parse('{"K":"FUCK YOU!"}')
  //   }

  //   HEADER = data["K"];

  //   switch (HEADER) {
  //     case "0":
  //       ws.posx = data["1"][0];
  //       ws.posy = data["1"][1];
  //       ws.posz = data["1"][2];
  //       ws.anims = 0;
  //       askHostForRender(`{"I":"${ws.id}","P":[${ws.posx}, ${ws.posy}, ${ws.posz}], "A":1, "D":${ws.didrenderonce}}`);
  //       ws.didrenderonce = true;
  //       break;
  //     case "A":
  //       pnum = CLIENTS.length;
  //       host = magic["Host"].length;
  //       webclie = magic["Webclient"].length;
  //       ws.send(`{"R":"success","0":${pnum},"1":${host}, "2":"${webclie}"}`);
  //       break;
  //     case "B":
  //       switch (data["1"]) {
  //         case "A":
  //           ws.serverset = "Host";
  //           break;
  //         case "B":
  //           ws.serverset = "Player";
  //           break;
  //         case "C":
  //           ws.serverset = "Webclient";
  //           break;
  //         default:
  //           ws.send('{"e":"ERROR, defaulting to json.}"')
  //           ws.serverset = "Player";

  //           refreshServersets();
  //       }
  //       break;
  //     case "G":
  //       resendClientConnections(data["data"])
  //       break;
  //     default:
  //       ws.send('{"R":"Not Defined"}')
  //   }