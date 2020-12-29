new Vue({
    el:'#wrapper',
    data:{
        //圖像尺寸
        tamWidth:[134,192,134,163,134,163,134,192,134],
        tamHeight:[163,134,163,134,192,134,163,134,163],
        //獲勝座標
        origX:[200,304,466,200,333,437,200,304,466],   
        origY:[100,100,100,233,204,233,337,366,337],
        //目前共有9片拼圖
        piece:9, 

        currentX:0,
        currentY:0,
        currentPosX:0,
        currentPosY:0,
        isMove: false,
        isMoveEnd: false,
    },
    methods:{
        //mousedown事件
        elementDown(event){
            let vm = this;
            let key = event.target.dataset.num;
            //取得滑鼠指向座標
            vm.currentX = event.clientX;
            vm.currentY = event.clientY;
            //取得元件現有座標
            vm.currentPosX = parseInt($(`.move${key}`).css("left").replace('px',''));
            vm.currentPosY = parseInt($(`.move${key}`).css("top").replace('px',''));
            //將指定物件置於最前面(z-index="10")
            $(`.move${key}`).css("z-index","10");
            //拼圖固定
            vm.positioinFix(key);
            //啟用mouseMove功能
            vm.isMove = true;  
        },

        //mousemove事件
        elementMove(event){
            let vm = this
            let key = event.target.dataset.num;
            if(vm.isMove == false){return}
            //現有座標自加事件滑鼠座標 - 原先滑鼠座標
            vm.currentPosX += event.clientX - vm.currentX;
            vm.currentPosY += event.clientY - vm.currentY;
            //添加座標
            $(`.move${key}`).css({ "left": vm.currentPosX, "top": vm.currentPosY });
            //執行後，讓下一個滑鼠座標事件等於原先滑鼠座標
            vm.currentX = event.clientX;
            vm.currentY = event.clientY;
            //啟用mouseOut & mouseUp功能
            vm.isMoveEnd = true;
        },
        //mouse離開事件
        elementMoveEnd(event){
            let vm = this;
            let key = event.target.dataset.num;
            if(vm.isMoveEnd == false){return}
            vm.checkWin();  //檢查獲勝條件
            vm.isMove = false;
            vm.isMoveEnd = false;
            $(`.move${key}`).css("z-index", key);
        },
        //位置固定
        positioinFix(key){
            let vm = this;
            for(var i=0;i<vm.piece;i++){
                if (Math.abs(vm.currentPosX - vm.origX[i])<15 && Math.abs(vm.currentPosY - vm.origY[i])<15) {
                    $(`.move${key}`).css("left", vm.origX[i]);
                    $(`.move${key}`).css("top", vm.origY[i]);
                }
            }
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
            if(checkNum == 9){ alert("你贏惹") }
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
                    z-index: ${value}
                    `
        },
    },
})