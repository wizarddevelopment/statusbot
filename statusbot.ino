#include "application.h"
#include "LiquidCrystal/LiquidCrystal.h"

// Colors
#define RGB_COLOR_RED   0xFF0000ul
#define RGB_COLOR_GREEN   0x00FF00ul
#define RGB_COLOR_BLUE    0x0000FFul
#define RGB_COLOR_YELLOW  0xFFFF00ul
#define RGB_COLOR_CYAN    0x00FFFFul
#define RGB_COLOR_MAGENTA 0xFF00FFul
#define RGB_COLOR_WHITE   0xFFFFFFul
#define RGB_COLOR_ORANGE    0xFF6000ul
#define WIZARD_ORANGE       0xc03f21ul
#define WIZARD_BLUE         0x285166ul
#define WIZARD_GRAY         0x515159ul

// Pins for backlight
#define R_PIN D0
#define G_PIN A0
#define B_PIN A1


// Make sure to update these to match how you've wired your pins.
// pinout on LCD [RS, EN, D4, D5, D6, D7];
LiquidCrystal lcd(A2, A3, D3, D4, D5, D6);

int brightness = 255;

void setup() {
  // set up the LCD's number of columns and rows:
  lcd.begin(16,2);

  // Setup pinmodes
  pinMode(R_PIN, OUTPUT);
  pinMode(G_PIN, OUTPUT);
  pinMode(B_PIN, OUTPUT);

  backlight(WIZARD_ORANGE);
    lcd.print("Wizard Dev");
  lcd.setCursor(0,1);
  lcd.print("Hello Programs!");
  delay(1000);
  lcd.setCursor(0,1);
  lcd.print("StatusBot Online");

  Spark.function("backlight", netBacklight);
  Spark.function("testBacklight", testBacklight);
  Spark.function("printLCD", printLCD);
}

void loop() {

}

int printLCD (String message) {
  lcd.clear();
  lcd.print(message);
  return 1;
}

int netBacklight(String args) {
  char color[7]; // six hex and null
  args.toCharArray(color, sizeof(color));
  backlight(strtoul(color,0, 16));
  return 1;
}

int testBacklight(String args) {
  backlight(RGB_COLOR_RED);
  delay(1000);
  backlight(RGB_COLOR_GREEN);
  delay(1000);
  backlight(RGB_COLOR_BLUE);
  delay(1000);
  backlight(WIZARD_ORANGE);
  delay(1000);
  backlight(WIZARD_BLUE);
  delay(1000);
  backlight(WIZARD_GRAY);
  delay(1000);
  return 1;
}

void backlight(unsigned long rgb) {
  // lcd.clear();

  int r = rgb >> 16 & 0x0000FF;
  int g = rgb >> 8 & 0x0000FF;
  int b = rgb & 0x0000FF;

  // lcd.print("RGB #");
  // lcd.print(r, HEX);
  // lcd.print(g, HEX);
  // lcd.print(b, HEX);

  // normalize the red and green LEDs - they are brighter than the rest!
  r = map(r, 0, 255, 0, 100);
  g = map(g, 0, 255, 0, 150);

  r = map(r, 0, 255, 0, brightness);
  g = map(g, 0, 255, 0, brightness);
  b = map(b, 0, 255, 0, brightness);

  // common anode so invert!
  r = map(r, 0, 255, 255, 0);
  g = map(g, 0, 255, 255, 0);
  b = map(b, 0, 255, 255, 0);

  analogWrite(R_PIN, r);
  analogWrite(G_PIN, g);
  analogWrite(B_PIN, b);
}
