
const { Worker, workerData, isMainThread, parentPort } =  require('worker_threads');

var QUEUE = [];
parentPort.on('message', ({task})=>{
    QUEUE.push(task);
})
while true {
  for (var i=0; i<QUEUE.length; i++) {
    parentPort.postMessage(calculateRC(QUEUE[i]));
  }
}

function calculateRC(task) {
  try {
    data = JSON.parse(task);  
  } catch {
    data = JSON.parse('{"K":"FAILED JSON PARSING", "0":"PLEASE_NO_ERROR!", "1":"FAILSAFE!"}')
  }
  
  header = data["K"];
  
  return "tesr"
}