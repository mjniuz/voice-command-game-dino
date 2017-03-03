	var max_level_L = 0;
	var old_level_L = 0;
	var cnvs = document.getElementById("test");
	var num = document.getElementById("num");
	var cnvs_cntxt = cnvs.getContext("2d");
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	
	var audioContext = new AudioContext();
	
	navigator.getUserMedia(
		{audio:true}, 
		function(stream){
			var microphone = audioContext.createMediaStreamSource(stream);
			var javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);
			
			microphone.connect(javascriptNode);
			javascriptNode.connect(audioContext.destination);
			javascriptNode.onaudioprocess = function(event){

				var inpt_L = event.inputBuffer.getChannelData(0);
				var instant_L = 0.0;

				var sum_L = 0.0;
				for(var i = 0; i < inpt_L.length; ++i) {
					sum_L += inpt_L[i] * inpt_L[i];
				}
				instant_L = Math.sqrt(sum_L / inpt_L.length);
				max_level_L = Math.max(max_level_L, instant_L);				
				instant_L = Math.max( instant_L, old_level_L -0.008 );
				old_level_L = instant_L;
				
				cnvs_cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
				cnvs_cntxt.fillStyle = '#00ff00';
				cnvs_cntxt.fillRect(10,10,(cnvs.width-20)*(instant_L/max_level_L),(cnvs.height-20)); // x,y,w,h
				num.innerHTML = "";
				num.innerHTML = (instant_L/max_level_L);
				
			}
		},
		function(e){ console.log(e); }
);