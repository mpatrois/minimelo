var ressources={

    "drum":[
    	{url:"audio/kicks/kick0.wav",type:"drum"},
	    {url:"audio/kicks/kick4.wav",type:"drum"},
	    {url:"audio/kicks/kick5.wav",type:"drum"}
	    ]
	,
	"cymbal":[
		{url:"audio/hats/hat1.wav",type:"cymbal"}
	],
    
    "flute":[
    	{url:"audio/snares/snare1.wav",type:"flute"}
    ],
    
    "piano":[
    	{url:"audio/pianos/piano1.wav",type:"piano"}
    ],
   
    "violin":[
    	{url:"audio/snares/snare2.wav",type:"violin"}
    ],
    
    "trumpet":[
    	{url:"audio/snares/snare3.wav",type:"trumpet"}
    ],
    
    "guitar":[
    	{url:"audio/kicks/kick3.wav",type:"guitar"}
    ],
    
    "voice":[
    	{url:"audio/kicks/kick2.wav",type:"voice"}
    ],

};

var colors=[
	"red",
	"yellow",
	"orange",
	"green",
	"violet",
	"pink",
	"grey",
	"blue"
]

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();