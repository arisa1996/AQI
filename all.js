window.onresize = function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 128 + 'px';
}
window.onresize();

new Vue({
    el:'#wrap',
    data:{
        nativeData:[],
        newData:{},
        selected:'高雄市',
        selectList:[],
        time: '',
        activeItem:{},
    },
    created() {
        this.getData()
    },
    methods: {
        getData(){
            axios.get('https://opendata.epa.gov.tw/api/v1/AQI?%24skip=0&%24top=1000&%24format=json&token=KJ8o24ff+0CVfaLmQPtcEw')
            .then(res => {
               return res.data
            })
            .then(data => {
                // console.log(data,'全部資料');
                data.forEach(data => {
                    const county = data.County;
                    if(!this.newData[county]){
                        this.$set(this.newData,county,[data])
                    }else{
                        this.newData[county].push(data)
                    }
                });
                this.nativeData = data; //原生資料
                //console.log(this.newData); //整理後的資料
                //預設初始畫面
                this.selectList = this.newData['高雄市'];
                this.time = this.newData['高雄市'][0].PublishTime;
                this.activeItem = this.newData[this.selected][0];
            })
            .catch(err => console.log('error is', err))     
        },
        textChange(val="") {
            // console.log(val)
            let index = val.search(/\(/); //regex
            if (index != -1) {
                val = val.slice(0,index) + '<br />'+val.slice(index);               
            }      
            return val
        },
        colorStyle(list){
            switch(list.Status){
                case '良好':
                    return 'box1'
                case '普通':
                    return 'box2'
                case '對敏感族群不健康':
                    return 'box3'
                case '對所有族群不健康':
                    return 'box4'
                case '非常不健康':
                    return 'box5'
                case '危害':
                    return 'box6'
            }
        },
        activeList(list){
            this.activeItem = list
        }
    },
    watch: {
        selected(newVal){
            let newList = this.newData[newVal];
            this.selectList = newList;
            this.time = newList[0].PublishTime;
            this.activeItem = this.newData[this.selected][0];
        }
    },
})