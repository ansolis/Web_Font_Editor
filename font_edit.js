// Create an object to store the font pixel info:
// - Contains a hex character
// - Contains x and y of the pixel position
// - Contains the byte index of the hex value in the font file
// - Contains the bit position of the pixel in the byte
// - Contains the bit value of the pixel (0 or 1)
var pixelObj = {
    hex: 0,
    x: 0,
    y: 0,
    byteIndex: 0,
    bitPosition: 0,
    pixelOnOff: 0,
};

var font_height = 12;
var font_width = 6;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var topDiv = document.getElementById('top');

// Sample 8x5 font:
//  |   |   | * |   |   |
//  |   | * |   | * |   |
//  | * |   |   |   | * |
//  | * |   |   |   | * |
//  | * | * | * | * | * |
//  | * |   |   |   | * |
//  | * |   |   |   | * |
//  | * |   |   |   | * |

// Each byte represents a column of the font character, with
// the least significant bit representing the top pixel and bytes
// representing columns in the order from left to right.
// var fontCharA = [0xFC, 0x12, 0x11, 0x12, 0xFC];

// Each byte represents a row of pixels where only the lowest 6 bits are used
// to represent up to 6 pixels for a character. The 12 bytes represent each of
// the 12 rows of pixels for the character.
// var fontChar4 = [0x02,0x00,0x0D,0x00,0x11,0x00,0x3F,0xC0,0x01,0x40,0x00,0x00];
var fontChar2 = [0x18,0xC0,0x21,0x40,0x22,0x40,0x24,0x40,0x18,0x40,0x00,0x00];

// Function to draw a filled box on the canvas
function fillBox(x, y, w, h) {
    // Get the canvas context
    // var ctx = document.getElementById("canvas").getContext("2d");
    context.beginPath();
    context.rect(x, y, w, h);
    context.fillStyle = "#000000";
    context.fill();
}

// Function to draw a filled box on the canvas
function drawBox(x, y, w, h) {
    // var ctx = document.getElementById("canvas").getContext("2d");
    context.strokeStyle = 'gray';
    context.beginPath();
    context.rect(x, y, w, h);
    context.stroke();
}

// Button click event handler
function save() {
    // Show an example of the text area contents
    document.getElementById("text").value = "Example: {0x18,0xC0,0x21,0x40,0x22,0x40,0x24,0x40,0x18,0x40,0x00,0x00}";

    var text = document.getElementById("text").value;

    // Extract hexadecimal values from the string
    var hexValues = getHexValues();
    console.log(hexValues);

    if (hexValues.length % font_height != 0) {
        alert("Invalid number of hex values");
        return;
    }

    // Draw the font on the canvas
    drawCharacter(hexValues);
}

function drawCharacter(hexValues) {
    for (var row = 0; row < font_height; row++) {
        for (var col = 0; col < font_width; col++) {
            var byte_offset = (col * 2) + Math.trunc(row / 8);
            var bit_offset = 7 - (row % 8);
            var bit_val = hexValues[byte_offset] & (1 << bit_offset);
            if (bit_val > 0) {
                fillBox(col * 20 + 1, 100 + row * 20 + 1, 18, 18);
            } else {
                drawBox(col * 20, 100 + row * 20, 20, 20);
            }
        }
    }
}

// Is the character a hex digit (e.g. 0, 1, A, F)
function isHexDigitChar(str) {
    return /[0-9A-Fa-f]/.test(str);
}

function isStartsWith0x(str) {
    return str.startsWith("0x") || str.startsWith("0X");
}

// Is the character a decimal digit (e.g. 0, 1, ... 9)
// function isDecimalDigitChar(str) {
//     return str >= "0" && str <= "9";
// }

// Function to extract hexadecimal values from the text area
function getHexValues() {
    var text = document.getElementById("text").value;
    var hexValues = [];
    var pos = 0;

    console.log("Text: " + text);

    // Loop through each character in the text
    while (pos < text.length) {
        var characterConsumed = false;

        // Consume everything up to the first "0x" or "0X"
        while ((pos < text.length - 1) && (!isStartsWith0x(text.substring(pos)))) {
            console.log("Non-hex digit character consumed: " + text[pos]);
            pos++;
            characterConsumed = true;
        }

        // Consume leading "0x"
        if ((pos < text.length - 1) && (text[pos] == "0") && ((text[pos + 1] == "x") || (text[pos + 1] == "X"))) {
            console.log("0x string consumed: " + text[pos] + text[pos + 1]);
            pos += 2;
            characterConsumed = true;
        }

        // Read up to two hex digits
        var hexDigitCount = 0;
        var hexDigit;
        var hexVal = 0;
        while ((pos < text.length) && (hexDigitCount < 2) && (isHexDigitChar(text[pos]))) {
            hexDigit = parseInt(text[pos], 16); // Convert character to integer with radix 16
            console.log("Hex digit " + hexDigitCount + " consumed: " + text[pos] + " hexDigit = " + hexDigit);
            hexVal = hexVal * 16 + hexDigit;
            pos++;
            hexDigitCount++;
            characterConsumed = true;
        }

        // Add the hex value to the array
        if (hexDigitCount > 0) {
            hexValues.push(hexVal);
        }

        if (!characterConsumed) {
            pos++;
        }
    }

    return hexValues;
}


// Event listener for the save button
document.getElementById("save").addEventListener("click", save);

// Event listener for the text area
//document.getElementById("text").addEventListener("input", save);


// Function to resize canvas to match its display size
function resizeCanvasToDisplaySize(canvas) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Check if the canvas size needs to change
    if (canvas.width !== width || canvas.height !== height) {
        const context = canvas.getContext('2d');

        // Get the current image data to preserve drawings
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Set the new canvas size
        canvas.width = width;
        canvas.height = height;

        // Restore the drawing
        context.putImageData(imageData, 0, 0);

        return true;
    }
    return false;
}

// Get canvas elements
const canvas1 = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');

// Initial resize
resizeCanvasToDisplaySize(canvas1);
resizeCanvasToDisplaySize(canvas2);

// Handle window resize
window.addEventListener('resize', () => {
    resizeCanvasToDisplaySize(canvas1);
    resizeCanvasToDisplaySize(canvas2);
    // Redraw canvas content here if necessary
});

// Placeholder for additional font editor functionalities
// For example, handling drawing on the canvas, saving fonts, etc.

// Example: Drawing context retrieval
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

// You can add event listeners and functions to handle drawing here
