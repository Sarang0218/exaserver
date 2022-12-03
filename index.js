
// Node.js WebSocket server script
const http = require('http');
// const WebSocketServer = require('websocket').server;
const fs = require('fs')


function writeHtml(outputStream) {
  const inputStream = fs.createReadStream('index.html')

  inputStream.pipe(outputStream)

  outputStream.on('finish', () => {
    console.log('served')
    outputStream.end();
  })
  outputStream.on('error', (e) => {
    console.error('errors', e)
    outputStream.end();
  })
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  writeHtml(res)
})
server.listen(3000);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  server: server
});
CLIENTS = [];
magic = { "Host": [], "Player": [], "Webclient": [] };
wss.on('connection', function(ws) {
  ws.serverset = "Player"
  ws.posx = 0;
  ws.posy = 0;
  ws.posz = 0;
  ws.anims = 0;
  ws.id = random_id();
  
  ws.send(`{"header":"OWNERDATA", "data":[{"id":"${ws.id}"}]}`)
  console.log("SENDING to CLIENT")
  ws.didrenderonce = false;
  CLIENTS.push(ws);
  refreshServersets();

  ws.on('message', function(message) {
    console.log('received: %s from %s', message, ws.serverset);
    n = message.toString()
    refreshServersets()

    try {
      data = JSON.parse(n);
    } catch {
      data = JSON.parse('{"K":"FUCK YOU!"}')
    }

    HEADER = data["K"];

    switch (HEADER) {
      case "0":
        ws.posx = data["1"][0];
        ws.posy = data["1"][1];
        ws.posz = data["1"][2];
        ws.anims = 0;
        askHostForRender(`{"I":"${ws.id}","P":[${ws.posx}, ${ws.posy}, ${ws.posz}], "A":1, "D":${ws.didrenderonce}}`);
        ws.didrenderonce = true;
        break;
      case "A":
        pnum = CLIENTS.length;
        host = magic["Host"].length;
        webclie = magic["Webclient"].length;
        ws.send(`{"R":"success","0":${pnum},"1":${host}, "2":"${webclie}"}`);
        break;
      case "B":
        switch (data["1"]) {
          case "A":
            ws.serverset = "Host";
            break;
          case "B":
            ws.serverset = "Player";
            break;
          case "C":
            ws.serverset = "Webclient";
            break;
          default:
            ws.send('{"e":"ERROR, defaulting to json.}"')
            ws.serverset = "Player";

            refreshServersets();
        }
        break;
      case "G":
        resendClientConnections(data["data"])
        break;
      default:
        ws.send('{"R":"Not Defined"}')
    }

  });
  ws.on('close', function() {
    CLIENTS = removeItemOnce(CLIENTS, ws)
    refreshServersets();
    console.log("LEFT")

  })
  console.log("[SERVER]: NEW USER JOINED");
});

function sendAll(message) {
  for (var i = 0; i < CLIENTS.length; i++) {
    CLIENTS[i].send(message);
  }
}
function refreshServersets() {
  magic = { "Host": [], "Player": [], "Webclient": [] };
  for (var i = 0; i < CLIENTS.length; i++) {
    magic[CLIENTS[i].serverset].push(CLIENTS[i])
  }
}

function askHostForRender(mes) {
  hostl = magic["Host"]
  for (var i = 0; i < hostl.length; i++) {
    hostl[i].send(mes);
    console.log("Sending... " + mes)
  }
}

function resendClientConnections(data) {
  k = magic["Player"]
  for (var i = 0; i < k.length; i++) {
    
    k[i].send(String(data));
    console.log("Sending... " + data + " to " + k[i].id);
  }
}
function random_id() {
  return '_' + (
    Number(String(Math.random()).slice(2)) +
    Date.now() +
    Math.round(performance.now())
  ).toString(36);
}
/*

K: HEADER

{"0":1, "1":8, ...}

--GAME LOGIC [0-9]--

MOVE: [0]

1: Position
2: AnimationState


BUIlD: [1]

1: Position
2: BuildingType

STORAGE_GET: [2]

1: Position

STORAGE_INTERACT [3]

1: Position
2: Mode
3: Itemtype

--WEB SERVING--

HOMEPAGE [A]

1: Location (URL)

CHANGE SERVERSET [B]

1: Settings

^ options:
    Host        -A
    Player      -B
    Webclient   -C

REFRESH SERVERSETS [C]


--Client Handling--

R: Return



-- HOST --

Sendback [G]

PlayerLocationData



*/