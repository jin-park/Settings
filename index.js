let device = null;
let writeCharacteristic = null;
// 아두이노용 서비스 uuid
const ARDUINO_BLE_SERVICE = 0xFFE0;
const ARDUINO_BLE_WRITE_CHARACTERISTIC = 0xFFE1;

// 블루투스 통신용 코드


async function connectToDevice() {
  try {
    console.log('Requesting Bluetooth Device...');
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: false,
      // 블루투스 목록 필터
      filters: [{
        services: [ARDUINO_BLE_SERVICE]  // 아두이노 블루투스 센서 Write 서비스
      }],
      optionalServices: [ARDUINO_BLE_SERVICE] // 쓰기 가능한 서비스 추가
    });

    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    console.log('Connected to GATT Server:', server);

    // 쓰기 특성을 가져오기
    const writeService = await device.gatt.getPrimaryService(ARDUINO_BLE_SERVICE);
    writeCharacteristic = await writeService.getCharacteristic(ARDUINO_BLE_WRITE_CHARACTERISTIC); // 쓰기 가능한 특성

    // 연결 문자 보내기
    await writeCharacteristic.writeValue(new TextEncoder().encode("Hello"));

    // Optionally, disconnect when done
    // device.gatt.disconnect();
  } catch (error) {
    console.error('Error connecting to device:', error);
  }
}

// 데이터 전달
async function sendData(data) {
  console.log(`Send data : ${data}`);
  if (writeCharacteristic && data) {
      const encoder = new TextEncoder();
      const value = encoder.encode(data + "\n");  // 입력값을 바이트 배열로 변환
      try {
          await writeCharacteristic.writeValue(value);  // 데이터를 블루투스 장치로 전송
      } catch (error) {
        //alert('데이터 전송에 실패했습니다.');
        console.error(`Error : ${error}`);
      }
  }
}

//  연결 해제
async function disconnectBluetooth() {
  if (device && device.gatt.connected) {
      device.gatt.disconnect();  // 블루투스 연결 해제
      alert(`Disconnected from ${device.name}`);
  } else {
      alert('이미 연결이 해제되었습니다.');
  }
}

// 슬라이더
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value



// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  console.log(this.value);
  sendData(this.value * 10);
}

{
  // var element = document.getElementsByClassName("switch")[0];

  // element.addEventListener("change", function (event) {
  //     if (event.target.checked) {
  //         console.log("Checked");
  //     } else {
  //         console.log("Not checked");
  //     }
  // });


  // let divElement = document.getElementsByClassName("switch")[0];
  // let isClicked = false;

  // divElement.addEventListener("click", function(){
  //   isClicked = true;
  //   sendData("HI");
  //   console.log(isClicked);
  // }, false);
}

// 누르면 보여지는 공간들
const touch_control = document.getElementById("touch-control");
const midi_settings = document.getElementById("midi-settings");
const practice_unit = document.getElementById("practice-unit");

// 터치 컨트롤의 요소들
const touch_main = document.getElementById("touch-main")
const touch_1 = document.getElementById("10");
const touch_2 = document.getElementById("11");
const touch_3 = document.getElementById("12");
const touch_4 = document.getElementById("13");

// 악보재생의 요소들
const midi_1 = document.getElementById("20");
const midi_2 = document.getElementById("21");

// 단위 연습의 요소들
const unit_1 = document.getElementById("30");
const unit_2 = document.getElementById("31");
const unit_3 = document.getElementById("32");
const unit_4 = document.getElementById("33");
const unit_5 = document.getElementById("34");

function panel_touch(panelName){
  const panel = document.getElementById(panelName);
  // 삼항 연산자
  // if (panel.className == "hidden"){
  //   panel.className = "";
  // }else{
  //   panel.className = "hidden";
  // }
  panel.className = panel.className == "hidden" ? "" : "hidden";
}

// 불리언을 인트로 바꾸는 함수
// 참이면 1 거짓이면 0
function parse_int_from_bool(value){
  if (value){
    return 1;
  }
  else{
    return 0;
  }
}

// 터치 제어용 함수
function touch_method(elem){
  switch_elem_method(elem);
}

// midi용 함수
function midi_method(elem){
  switch_elem_method(elem)
}

// 단위용 함수
function unit_method(elem){
  sendData(elem.id + "0");
}

// 스위치 요소용 함수
function switch_elem_method(elem){
  sendData(elem.id + parse_int_from_bool(elem.checked));
}

// 터치 제어 요소를 제어하는 메인 요소의 함수
function main_touch_method(){
  if(touch_main.checked){
    touch_1.disabled = false;
    touch_2.disabled = false;
    touch_3.disabled = false;
    touch_4.disabled = false;
  }
  else{
    // 상호작용 불가
    touch_1.disabled = true;
    touch_2.disabled = true;
    touch_3.disabled = true;
    touch_4.disabled = true;
    // 체크 해제
    touch_1.checked = false;
    touch_2.checked = false;
    touch_3.checked = false;
    touch_4.checked = false;
    // 체크 해제 명령 보내기
    sendData(-100);
  }
}

main_touch_method();

// 이벤트 달아주기
touch_control.addEventListener('click', () => panel_touch("touch-control-panel"));
midi_settings.addEventListener('click', () => panel_touch("midi-settings-panel"));
practice_unit.addEventListener('click', () => panel_touch("practice-unit-panel"));

touch_main.addEventListener('change', main_touch_method);

touch_1.addEventListener('change', () => touch_method(touch_1));
touch_2.addEventListener('change', () => touch_method(touch_2));
touch_3.addEventListener('change', () => touch_method(touch_3));
touch_4.addEventListener('change', () => touch_method(touch_4));

midi_1.addEventListener('change', () => midi_method(midi_1));
midi_2.addEventListener('change', () => midi_method(midi_2));

unit_1.addEventListener('click', () => unit_method(unit_1));
unit_2.addEventListener('click', () => unit_method(unit_2));
unit_3.addEventListener('click', () => unit_method(unit_3));
unit_4.addEventListener('click', () => unit_method(unit_4));
unit_5.addEventListener('click', () => unit_method(unit_5));