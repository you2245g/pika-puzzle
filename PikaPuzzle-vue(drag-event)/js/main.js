let nn = new Vue({
    el:'#wrapper',
    data:{
        //圖像尺寸
        tamWidth:[134,192,134,163,134,163,134,192,134],
        tamHeight:[163,134,163,134,192,134,163,134,163],
        //獲勝座標
        origX:[200,304,466,200,333,437,200,304,466],   
        origY:[100,100,100,233,204,233,337,366,337],
        piece:9, //目前共有9片拼圖
        nowSelect:0, //目前選取編號
        dragContainer:0,
        dragStatus:"",
    },
    methods:{
        //drag事件
        dragstart(event){
            let vm = this;
            vm.dragStatus = "";
            vm.nowSelect = event.target.dataset.num;
            //隱藏元件
            setTimeout( () => $(`.move${vm.nowSelect}`).addClass('onWork'),0);
            //定義位置
            let style = window.getComputedStyle(event.target, null);
            event.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
        },
        dragenter(event){
            let vm = this;
            event.target.className += " hover";
            vm.dragContainer = event.target.dataset.num;
        },
        dragleave(event){
            event.target.className = "block";
        },
        //dragend顯示物件
        dragend(){
            let vm = this;
            $(`.move${vm.nowSelect}`).removeClass('onWork');
            vm.dragStatus = $(`.block[data-num="${vm.dragContainer}"]`).attr("class");
            $(`.block[data-num="${vm.dragContainer}"]`).attr("class","block");
        },
        drop(event){
            let vm = this;
            //求得座標，定義位置
            let offset = event.dataTransfer.getData("text/plain").split(',');  
            
            setTimeout(function(){
                if (vm.dragStatus == "block hover") {  //置入容器
                    $(`.move${vm.nowSelect}`).css({ 
                        "left": vm.origX[vm.dragContainer - 1] + 'px', 
                        "top": vm.origY[vm.dragContainer - 1] + 'px'
                    });
                }else{   // 任意位置
                    $(`.move${vm.nowSelect}`).css({ 
                        "left": event.clientX + parseInt(offset[0],10) + 'px', 
                        "top": event.clientY + parseInt(offset[1],10)  + 'px'
                    });
                }
            }, 0)
            //每次dorp下，檢查獲勝條件
            setTimeout( () => vm.checkWin(),1 )
        },
        //檢查獲勝條件(座標對座標)
        checkWin(){
            let vm = this;
            let checkNum = 0;
            for(var i=1;i<=vm.piece;i++){
                var posx = parseFloat($(`.move${i}`).css("left"));    
                var posy = parseFloat($(`.move${i}`).css("top"));
                let checkNumber = parseInt( $(`.move${i}`).attr("data-num") );
                if(vm.origX[checkNumber - 1] == posx && vm.origY[checkNumber - 1] == posy){
                    checkNum += 1;
                }
            }
            if(checkNum == 9){  
                $('.showWin').attr('class','showWin');
            }else{
                $('.showWin').attr('class','showWin onWork');
            }
        },
        //拼圖塊圖像
        imgsrc(value){ return `img/${value}.png` }, 
        moveCss(value){ return `move${value}` },
        outward(value){
            let vm = this;
            return `
                    left:${Math.floor(Math.random() * 10 + 1)}px ; 
                    top:${Math.floor(Math.random() * 409 + 1)}px ;
                    width: ${ vm.tamWidth[parseInt(value) - 1] }px ;
                    height: ${ vm.tamHeight[parseInt(value) - 1] }px ;
                    z-index: ${value + 1}
                    `
        },
    },
})