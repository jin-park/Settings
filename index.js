
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

async function connectToDevice() {
  try {
    console.log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
      // Filters can be used to narrow down the devices shown to the user.
      acceptAllDevices: true,
    });

    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    console.log('Connected to GATT Server:', server);

    // Optionally, disconnect when done
    // device.gatt.disconnect();
  } catch (error) {
    console.error('Error connecting to device:', error);
  }
}