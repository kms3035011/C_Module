/*초성은 나중에*/
/*쉬운부분부터 차근차근풀기*/
/*모르는부분 있으면 그냥 넘어가기*/
// mouseup
// mousemove
// mousedown
// arr = [1];
//  console.log(e.offsetX,e.offsetY);
// 드래그 영역에 마우스 업 했을때
// 이미 카트에 들어가 있는지 체크를 한다.
// 이미 들어가 있으면 들어가지 못하게 막고 알트 띄우고
// 안들어가져 있으면 추가한다.
// 중복값 제거, 중복안되면 추가, 수량에 따른 합계, 각각 리스트에 따른 총합계
window.onload = function () {
    String.prototype.replaceAll = function (find, replace) { // 바꾸고 싶은 문자열 다 바뀌게 해줌
        return this.split(find).join(replace);
    }
    String.prototype.changeStr = function() {
        return this.split('').map(v => {
            let arr = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split('');
            if(arr.includes(v)) return v;
            else return arr[Math.floor(parseInt((v.charCodeAt(0) - "가".charCodeAt(0) )/588) )] ?? v;
        }).join('');
    }
    let
        offsetX,
        offsetY,
        tg,
        list,
        click = false,
        chkList = [],
        id = [],
        cho = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');

    MouseDown = e => { // 마우스를 눌렀을때
        $(".img-move").append($(e.target).clone());
        $(e.target).css({ "visibility": "hidden" });
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        tg = $(e.target).parents(".item").data("idx");
        // console.log(tg);
        $(".img-move>img").css({ "left": e.clientX - e.offsetX, "top": e.clientY - e.offsetY });
        click = true;
        e.preventDefault();
    }

    mouseUp = e => { //마우스가 손에서 때졌을때
        if ($(e.target).is(".dropbox p") && click == true) {
            if (chkList.includes(tg)) alert("이미 장바구니에 담긴 상품입니다.");
            else {
                chkList.push(tg);
                // console.log("Asd");
                Create(list[tg - 1], "cart");
                Sum();
            }
        }
        click = false;
        $(".img-move>*").remove();
        $(".item-img>img").css({ "visibility": "" });
    }
    Change = e => { // input값 증감 부분
        $(e.target).val($(e.target).val())
        let
            num = Math.floor($(e.target).val()),
            price = $(e.target).parents(".item-list").find(".text-info>p:nth-child(3)").text().trim().replaceAll(',', '');
        // console.log($(e.target).parents())
        let sum = num *= Number(price.replace(/[^\d]+/g, ''));
        $(e.target).siblings(".num-info").find('.sum').text(sum.toLocaleString());
        Sum();

    }
    Remove = e => { //삭제
        $(".item-list:nth-child(1)").remove();
        // console.log(chkList.indexOf($(e.target).data("idx")))
        chkList.splice(chkList.indexOf($(e.target).data("idx")), 1)
        Sum();
        // console.log(chkList)
    }
    Sum = e => { //계산함수
        let totalPrice = 0;
        $.each($(".item-list"), function (i, v) {
            let
                price = +$(v).find(".price").text().replace(/\,/g, ""),
                cnt = Math.floor(+$(v).find(".count").val());
            totalPrice += price * cnt;
            // totalPrice += Number(e.price.replace(/[^\d]+/g, ''));
        })
        // $.each($(".item-list"), function (i, v) {
        //     $.each(list, function (j, e) {
        //         if ($(v).data("idx") - 1 == j) {
        //             totalPrice += Number(e.price.replace(/[^\d]+/g, ''));
        //                 // console.log(e.price);
        //         }
        //     })
        // })
        $(".total-num").text(totalPrice.toLocaleString() + '원')
    }
    Search = e => { // 검색부분
        $(".store-list").empty();
        let val = $(e.target).val();
        list.forEach(({id, photo, brand, product_name, price}) => {
            let cho = brand.changeStr(), arr = [];

            if(cho.includes(val)) {
                if(val.length === 1) cho.split('').forEach((v, idx) => {if(v === val) arr.push(brand[idx])});
                else arr.push(brand.substr(cho.indexOf(val), val.length));
            }else if(brand.includes(val)) {
                arr.push(brand.substr(brand.indexOf(val), val.length));
            }
            
            if(arr.length !== 0){
                arr.forEach(v => brand = brand.replaceAll(v, `<span class ="up">${v}</span>`));
                product_name = brand;
                Create({id, photo, brand, product_name, price});
            }
            
            if(arr.length === 0 && val === "") Create({id, photo, brand, product_name, price});
        });
        console.log($("#store .item").length);
        if($(".store-list .item").length === 0) $(".store-list").html(`<p>일치하는 상품이 없습니다.</p>`);
    }
   openPopup = e => {
        $("#popup").css({"display": "block"});
   }
   closePopup = e => {
       $("#popup").css({"display" : "none"});
   }
   Close = e => {
       $("#result").css({"display" : "none"});
   }
   Openresult = e => {
       
       $("#result").css({"display" : "block"})
   }
    Create = ({ id, photo, brand, product_name, price }, txt = "") => { // 스토어 리스트
        if (txt !== "cart") {
            $('.store-list').append(`
        <div class="item" data-idx="${id}"> 
            <div class="item-img">
                <img src="./public/img/product/${photo}" alt="img" title="img">
            </div>
            <div class="item-text">
                <p>상품명 : ${product_name} </p>
                <p>브랜드명 : ${brand} </p>
                <p>가격 : ${price}원</p>
                </div>
            </div>
        </div>`
            );
        } else {
            $('.cart').append(`
            <div class="item-list" data-idx="${id}"> 
                <div class="img-item">
                    <div class="close" data-idx="${id}">X</div>
                    <img src="./public/img/product/${photo}" alt="img" title="img">
                </div>
                <div class="text-info">
                    <p>상품명 : ${product_name}</p>
                    <p>브랜드명 : ${brand}</p>
                    <p>가격 : <span class="price">${price}</span></p>
                    <label>수량 : </label>
                    <input type="number" class="count" min="1" value = "1">
                    <div class="num-info">
                        <p class="sum">${price}</p>
                    </div>
                </div>
            </div>`);
        }
    }

    eve = _ => {  //이벤트 모음 함수
        $(document)
            .on("mousedown", ".item-img>img", MouseDown)
            .on("mouseup", mouseUp)
            .on("mousemove", function (e) {
                $(".img-move>img").css({ "left": e.clientX - offsetX, "top": e.clientY - offsetY })
            })
            .on("input", ".count", Change)
            .on("click", ".close", Remove)
            .on("keyup", '.searchbox', Search)
            .on("click", "#openpop", openPopup)
            .on("click", "#buyno", closePopup)
            .on("click", "#closeresult", Close)
            .on("click", "#buyok", Openresult)
    }

    init = data => {
        list = data;
        // console.log(data);
        $.each(data, function (index, { id, photo, brand, product_name, price }) {
            Create({ id, photo, brand, product_name, price });
        });

        eve();
    }

    // $('.close').remove();
    $('.item-list').remove();
    $('.item').remove();
    fetch('./public/store/store.json')
        .then(file => file.json())
        .then(data => init(data));
}


// window.onload = function(){
//     // $('.close').remove();

//     $('.item-list').remove();
//     $('.item').remove();

//     let offsetX, offsetY;
//     let click = false;
//     let id = [1];
//     // console.log($(".store-list .item").eq(0).data("idx"))
//     fetch('./store/store.json')
//     .then(file => file.json())
//     .then(data => init(data));

//     $.getJSON('./store/store.json',function(data){
//         let info = [];
//         $.each(data, function(i,e){
//             if($.inArray(e.info, info) === -1) info.push(e.info);
//             $('.store-list').append(`
//                 <div class="item" data-idx="${e.id}">
//                     <div class="item-img">
//                         <img src="./img/product/${e.photo}" alt="img" title="img">
//                     </div>
//                     <div class="item-text">
//                         <p>상품명 : ${e.product_name} </p>
//                         <p>브랜드명 : ${e.brand} </p>
//                         <p>가격 : ${e.price}원</p>
//                         </div>
//                     </div>
//                 </div>`
//             );
//         });
//         $(document)
//         .on("mousedown", ".item-img>img", function(e){
//            $(".img-move").append($(this).clone());
//            $(this).css({"visibility" : "hidden"});
//         //  console.log(e.offsetX,e.offsetY);
//         // 드래그 영역에 마우스 업 했을때
//         // 이미 카트에 들어가 있는지 체크를 한다.
//         // 이미 들어가 있으면 들어가지 못하게 막고 알트 띄우고
//         // 안들어가져 있으면 추가한다.
//            offsetX=e.offsetX;
//            offsetY=e.offsetY;
//            $(".img-move>img").css({"left" : e.clientX - e.offsetX, "top" : e.clientY - e.offsetY});
//            click = true;
//         })
//         .on("mouseup", e => {

//             if($(e.target).is(".dropbox p") && click == true){

//                 // console.log(e.target)
//                 if(id.includes(1)){
//                     return alert("이미 선택된 상품입니다.");
//                 }

//                 $('.cart').append(`
//                 <div class="item-list">
//                     <div class="img-item">
//                         <div class="close">X</div>
//                         <img src="./img/product/product_1.jpg" alt="img" title="img">
//                     </div>
//                     <div class="text-info">
//                         <p>상품명 : ${data[0].product_name}</p>
//                         <p>브랜드명 : ${data[0].brand}</p>
//                         <p>가격 : ${data[0].price}</p>
//                         <label>수량 : </label>
//                         <input type="number" class="count">
//                     </div>
//                 </div>`);
//                 click = false;

//             }
//             $(".img-move>*").remove();
//             $(".item-img>img").css({"visibility" : ""})
//         })
//         .on("mousemove", function(e){
//             $(".img-move>img").css({"left" : e.clientX - offsetX, "top" : e.clientY - offsetY})
//         })
//         .on("change", ".count", function(){
//           $(this).val();
//         //   console.log($(this).parents())
//         $(this).parents;
//         });

//     });
// }
// // $(this).siblings()
// // $(this).parents()
// // $(this).children()