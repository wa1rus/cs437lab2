document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65433;
var server_addr = "192.168.1.155";   // the IP address of your Raspberry PI

var goRight = false; 
var goLeft = false; 
var goForward = false;
var goBackward = false;

var temperature = 0; 
var angle = 0; 

function client() {
        
    const net = require('net');
    var input = document.getElementById("message").value;

    const client = net.createConnection({ port: server_port, host: server_addr }, () => { message
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
                
        if(goForward) {
            sendString+="F";
        } 
        else if(goBackward) {
            sendString+="B";
        }
        else if(goLeft) {
            sendString+="L";
        }
        else if(goRight) {
            sendString+="R";
        }
    
        client.write(`${sendString}\r\n`);
    }); 

     // get the data from the server
     client.on('data', (data) => {
        document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        
        let numbers = [];
        let currentNumber = '';
        let string = data; 
        for (let i = 0; i < string.length; i++) {
            if (string[i] === 'A') {
            let j = i + 1;
            while (j < string.length && /\d/.test(string[j])) {
                currentNumber += string[j];
                j++;
            }
            if (currentNumber !== '') {
                numbers.push(parseInt(currentNumber));
                currentNumber = '';
            }
            }
            else if (string[i] === 'T') {
            let j = i + 1;
            while (j < string.length && /\d/.test(string[j])) {
                currentNumber += string[j];
                j++;
            }
            if (currentNumber !== '') {
                numbers.push(parseInt(currentNumber));
                currentNumber = '';
            }
            }
        }
        
        temperature = numbers[1]; 
        angle = numbers[0];
        
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });

}       
        
// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        
        goRight = false; 
        goLeft = false; 
        goForward = true; 
        goBackward = false; 
    }   
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        
        goRight = false;  
        goLeft = false;   
        goForward = false;
        goBackward = true;  
    }   
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        goRight = false; 
        goLeft = true; 
        goForward = false; 
        goBackward = false;  
    }   
    else if (e.keyCode == '68') { 
        // right (d) 
        document.getElementById("rightArrow").style.color = "green";
        goRight = true; 
        goLeft = false;  
        goForward = false; 
        goBackward = false;  
    }   
}       
        
// reset the key to the start state 
function resetKey(e) {
        
    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}       


// update data for every 50ms
function update_data() {
    setInterval(function() {
        
        if(goLeft) { 
            document.getElementById("direction").innerHTML = "left";
        }
        if(goRight) { 
            document.getElementById("direction").innerHTML = "right";
        }
        if(goForward) { 
            document.getElementById("direction").innerHTML = "forward";
        }
        if(goBackward) { 
            document.getElementById("direction").innerHTML = "backward";
        }

        document.getElementById("angle").value = angle;
        document.getElementById("temperature").value = temperature;
        

        client();       
    }, 50);             
    
}
