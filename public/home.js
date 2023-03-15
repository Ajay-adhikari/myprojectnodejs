const http=require('http');
const fs=require('fs');
const url=require('url');
var requests = require('requests');
const path=require('path');

const  homeFile=fs.readFileSync('./public/index.html' , "utf-8");
// console.log(path.join(__dirname+"/index.html"));
const replaceVal=(tempVal , orgval)=>{
    let temperature=tempVal.replace("{%tempval%}" , orgval.current.temp_c);
    temperature=temperature.replace("{%tempmin%}" , orgval.current.condition.text);
    temperature=temperature.replace("{%tempmax%}" , orgval.current.condition.text);
    temperature=temperature.replace("{%location%}" , orgval.location.name);
    temperature=temperature.replace("{%country%}" , orgval.location.country);
    
    return temperature;
}
const server=http.createServer((req, res)=>{

    if(req.url=="/"){
        requests('https://api.weatherapi.com/v1/current.json?key=ee2250ab7853442ba6895805231003&q=bareilly&aqi=no' )
        .on("data",  (chunk)=> {
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
            // const realtimedata=arrData.map(val=>replaceVal(homeFile , val));
            // console.log(val.location);
            const realtimedata=arrData.map(val=>replaceVal(homeFile , val)).join("");
                
            res.write(realtimedata);
            
        })
        .on("end",  (err)=> {
            if (err) return console.log('connection closed due to errors', err);
        
            res.end();
        });
        
    }
});

server.listen(8000 , "127.0.0.1");