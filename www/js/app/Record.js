define(function( require ) {
	
	'use strict';

	var audioCtx = new AudioContext();
	var ctx = canvasRecord.getContext('2d');

	var ResourcesHandler = require('app/ResourcesHandler');

	navigator.getUserMedia = navigator.getUserMedia ||
							 navigator.webkitGetUserMedia ||
							 navigator.mozGetUserMedia;

	var liblame = new lamejs();

	function encodeMono(channels, sampleRate, samples) {
        var buffer = [];
        var mp3enc = new liblame.Mp3Encoder(channels, sampleRate, 128);
        var remaining = samples.length;
        var maxSamples = 1152;
        for (var i = 0; remaining >= maxSamples; i += maxSamples) {
            var mono = samples.subarray(i, i + maxSamples);
            var mp3buf = mp3enc.encodeBuffer(mono);
            if (mp3buf.length > 0) {
                buffer.push(new Int8Array(mp3buf));
            }
            remaining -= maxSamples;
        }
        var d = mp3enc.flush();
        if(d.length > 0){
            buffer.push(new Int8Array(d));
        }
        var blob = new Blob(buffer, {type: 'audio/mp3'});
        return blob;
        // console.log('done encoding, size=', buffer.length);
        // 
        // var bUrl = window.URL.createObjectURL(blob);
        // console.log('Blob created, URL:', bUrl);
        // window.myAudioPlayer = document.createElement('audio');
        // window.myAudioPlayer.src = bUrl;
        // window.myAudioPlayer.setAttribute('controls', '');
        // window.myAudioPlayer.play();
    }
    // var wavFile = "testdata/Left44100.wav";
    // var request = new XMLHttpRequest();
    // request.open("GET", wavFile, true);
    // request.responseType = "arraybuffer";
    // Our asynchronous callback
    // request.onload = function () {
    //     audioData = request.response;
    //     wav = liblame.WavHeader.readHeader(new DataView(audioData));
    //     console.log('wav:', wav);
    //     samples = new Int16Array(audioData, wav.dataOffset, wav.dataLen / 2);
    //     encodeMono(wav.channels, wav.sampleRate, samples);
    // };


	function Record(){
		this.scriptNode     = null;
		this.scriptNodePlay = null;
		this.streamRecord   = null;
		this.microphone     = null;
		this.recordBuffer   = null;
		this.idPlayInterval = null;
		this.arrayData      = new Float32Array(0);
		this.startSong      = 0;
		this.stopSong       = 0;
		this.playStart      = 0;
		this.recorToPlay    = null;
		this.playing        = false;
	}

	Record.prototype.startRecord=function()
	{	
		var self=this;

		if(self.streamRecord!=null){
			self.stopRecord();
		}
		navigator.getUserMedia({audio: true},
			function(stream){
				self.streamRecord=stream.getAudioTracks()[0];
				self.microphone = audioCtx.createMediaStreamSource(stream);
				self.scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
				self.microphone.connect(self.scriptNode);
				self.scriptNode.connect(audioCtx.destination);
				self.arrayData=new Float32Array();
				
				self.scriptNode.onaudioprocess=function(e){

					var data=e.inputBuffer.getChannelData(0);

					var length=self.arrayData.length;
					var newLength=length+data.length;
					var newArray=new Float32Array(newLength);

					newArray.set(self.arrayData,0);
					newArray.set(data,length);
					self.arrayData=newArray;

				}
			},
			function(error){
				console.log(error);
			}
		);
		
	}
	Record.prototype.stopRecord=function(){
		this.streamRecord.stop();
		this.microphone.disconnect();
		this.scriptNode.disconnect();

		this.recordBuffer = audioCtx.createBuffer(1, this.arrayData.length, audioCtx.sampleRate);
		var output = this.recordBuffer.getChannelData(0);
		for (var i = 0; i < this.arrayData.length; i++) {
			output[i] = this.arrayData[i];
		}

		this.drawRecord(this.recordBuffer);
	}

	Record.prototype.drawRecord=function(){
		var binSize = ( this.recordBuffer.duration * this.recordBuffer.sampleRate ) / canvasRecord.width;
		ctx.clearRect(0,0,canvasRecord.width,canvasRecord.height);
		ctx.beginPath();
		
		var linePosition=10;
		ctx.moveTo(0,canvasRecord.height-linePosition);

		var data=this.recordBuffer.getChannelData(0);
		var xOnCanvas=0;

		for (var i=0,len=data.length; i<len; i+=binSize)
		{
		  //avec la moyenne moins performant mais plus precis
		  // var tempdata=data.subarray(i,i+binSize);
		  // ctx.lineTo(xOnCanvas,canvasRecord.height-Math.abs(Math.max.apply(Math, tempdata) * canvasRecord.height/1.3)-linePosition);
		   
		   //sans la moyenne
		  var tempdata=data.subarray(i,i+binSize)[0];
		  ctx.lineTo(xOnCanvas,canvasRecord.height-Math.abs(tempdata * canvasRecord.height/1.1)-linePosition);

		  xOnCanvas++;
		}
		ctx.lineTo(canvasRecord.width,canvasRecord.height-linePosition);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(0,canvasRecord.height-linePosition);
		ctx.lineTo(canvasRecord.width,canvasRecord.height-linePosition);
		ctx.closePath();
		ctx.stroke();
	}

	Record.prototype.playRecord=function(){
		var self=this;
		if(this.playing==true){
			this.recorToPlay.stop();
			clearInterval(this.idPlayInterval);
		}
		else{
			this.recorToPlay = audioCtx.createBufferSource();
			this.recorToPlay.buffer = this.recordBuffer;
			this.recorToPlay.start(0);
			this.playStart=audioCtx.currentTime;
			this.playing=true;

			this.scriptNodePlay = audioCtx.createScriptProcessor(256, 1, 1);
			this.recorToPlay.connect(self.scriptNodePlay);
			self.scriptNodePlay.connect(audioCtx.destination);
			

			this.scriptNodePlay.onaudioprocess=function(e){
				var timeInPx = self.getXOnSong(audioCtx.currentTime-self.playStart);
				lineRecord.style.left=timeInPx+"px";

			}

			this.recorToPlay.onended=function () {
				self.playing=false;
				lineRecord.style.left="0px";
				self.scriptNodePlay.disconnect();
				self.scriptNodePlay=null;
			}
			this.recorToPlay.connect(audioCtx.destination);
		}
	}

	Record.prototype.drawSelector=function(){
		var left=Math.min(this.startSong,this.stopSong);
		var width=Math.abs(this.startSong-this.stopSong);
		selector.style.left=left+"px";
		selector.style.width=width+"px";
	}

	Record.prototype.getPositionOnSong=function(x){
		var pxInSecond=this.recordBuffer.duration/canvasRecord.width;
		return x*pxInSecond;
	}

	Record.prototype.getXOnSong=function(sec){
		var pxInSecond=this.recordBuffer.duration/canvasRecord.width;
		return sec/pxInSecond;
	}

	Record.prototype.getStartSample=function(){
		return this.getPositionOnSong(Math.min(this.startSong,this.stopSong));
	}
	Record.prototype.getStopSample=function(){
		return this.getPositionOnSong(Math.max(this.startSong,this.stopSong));
	}

	Record.prototype.getDurationSample=function(){
		return this.getStopSample()-this.getStartSample();
	}

	Record.prototype.cutRecord=function(){

		var startPos=this.getStartSample();
		var stopPos=this.getStopSample();
		var duration=this.getDurationSample();

		var channels = this.recordBuffer.numberOfChannels;
		var frameCount = this.recordBuffer.sampleRate * duration;
		var frameStart = this.recordBuffer.sampleRate * startPos;
		var frameEnd = this.recordBuffer.sampleRate * stopPos;

		console.log(frameCount);
		console.log(this.recordBuffer.sampleRate);

		var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, this.recordBuffer.sampleRate);

		for (var channel = 0; channel < channels; channel++) {
		  var nowBuffering = myArrayBuffer.getChannelData(channel);
		  var pos=0;
		  for (var i = Math.round(frameStart); i < Math.round(frameEnd); i++) {
			nowBuffering[pos] = this.recordBuffer.getChannelData(channel)[i];
			pos++;
		  }
		}
		this.recordBuffer=myArrayBuffer;	
	}

	Record.prototype.generateFileName=function(){
		return "mini_"+Date.timestamp()+".mp3";
	};

	Record.prototype.saveRecord=function(){
		var self=this;
		var worker = new Worker('js/app/RecordWorker.js');
		worker.postMessage({
		  command: 'init',
		  config: {sampleRate: this.recordBuffer.sampleRate,numChannels:this.recordBuffer.numberOfChannels}
		});

		// callback for `exportWAV`
		worker.onmessage = function( e ) {
			

			var fileName=self.generateFileName();

			window.resolveLocalFileSystemURL("file:///sdcard/Minimelo/indefini", function (fileSystem) {

				fileSystem.getFile(fileName, {create: true, exclusive: false}, function(fileEntry){
								
				fileEntry.createWriter(function(writer){
					writer.onwriteend=function(evt){
						console.log("audio enregistre "+fileName);
					}
					var fileReader = new FileReader();
					fileReader.onload = function() {
					    var arrayBuffer = this.result;
						var wav = liblame.WavHeader.readHeader(new DataView(arrayBuffer));
				        console.log('wav:', wav);
				        var samples = new Int16Array(arrayBuffer, wav.dataOffset, wav.dataLen / 2);
				        var blobMp3=encodeMono(wav.channels, wav.sampleRate, samples);
				        writer.write(blobMp3);
					};
					fileReader.readAsArrayBuffer(e.data);
					

				}, fail);

			}, fail);

			}, function(error){
				console.log(error);
			});

		};

		// send the channel data from our buffer to the worker
		worker.postMessage({
		command: 'record',
		buffer: [
		  this.recordBuffer.getChannelData(0)
		]
		});

		worker.postMessage({
		  command: 'exportWAV',
		  type: 'audio/wav'
		});

		  //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

																	//GotFS


	}

	function gotFS(fileSystem) {
		fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
	}

	function gotFileEntry(fileEntry) {
		fileEntry.createWriter(gotFileWriter, fail);
	}

	function gotFileWriter(writer) {
		writer.onwriteend = function(evt) {
			console.log("contents of file now 'some sample text'");
			writer.truncate(11);
			writer.onwriteend = function(evt) {
				console.log("contents of file now 'some sample'");
				writer.seek(4);
				writer.write(" different text");
				writer.onwriteend = function(evt){
					console.log("contents of file now 'some different text'");
				}
			};
		};
		writer.write("some sample text");
	}

	function fail(error) {
		console.log(error.code);
	}


	return Record;

});

