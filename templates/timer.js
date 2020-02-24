import icon from "./timer.png";

export default {
  type: "timer",
  description: "timer",
  group: "etc",
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon,
  model: {
    type: "timer",
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    strokeStyle: "darkgray",
    text: "#{data}",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    "format-run": "mm:ss",
    "format-stop": "--:--"
  }
};
