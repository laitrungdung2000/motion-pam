const spawn = require('child_process').spawn;
const fs = require('fs');
const rawdata = fs.readFileSync(__dirname + '/examples/rtsp_link.json');
const rtsp_link = JSON.parse(rawdata);

rtsp_link.forEach((rtsp, index) => {
    var params = [
        '-loglevel',
        'quiet',
        /* use hardware acceleration */
        '-hwaccel',
        'auto', // vda, videotoolbox, none, auto
        /* use an artificial video input */
        // '-re',
        // '-f',
        // 'lavfi',
        // '-i',
        // 'testsrc=size=1920x1080:rate=15',
        /* use an rtsp ip cam video input */
        '-rtsp_transport',
        'tcp',
        '-i',
        /* set output flags */
        '-an',
        '-c:v',
        'pam',
        '-pix_fmt',
        'gray',
        // 'rgba',
        // 'rgb24',
        '-f',
        'image2pipe',
        '-vf',
        'fps=2,scale=400:225', // 1920:1080 scaled down = 640:360, 400:225, 384:216, 368:207, 352:198, 336:189, 320:180
        // 'fps=1,scale=iw*1/6:ih*1/6',
        // '-frames',
        // '100',
        'pipe:1',
    ]
    params.splice(7, 0, rtsp);
    var files = fs.createWriteStream(__dirname + `/examples/${index}.json`);
    files.write(JSON.stringify(params));
    files.on('error', function(err) {
        console.log("Err: ", err);
    });
    var cameraParams = [
        __dirname + '/examples/example.js',
        __dirname + `/examples/${index}.json`
    ]
    console.log(cameraParams)
    var cameraProcess = spawn('node', cameraParams);
    cameraProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
      
    cameraProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    cameraProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

