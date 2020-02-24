/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import format from "./libs/format";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "number",
      label: "days",
      name: "days",
      placeholder: "days"
    },
    {
      type: "number",
      label: "hours",
      name: "hours",
      placeholder: "hours"
    },
    {
      type: "number",
      label: "minutes",
      name: "minutes",
      placeholder: "minutes"
    },
    {
      type: "number",
      label: "seconds",
      name: "seconds",
      placeholder: "seconds"
    },
    {
      type: "string",
      label: "format-run",
      name: "format-run",
      placeholder: "hh:mm:ss"
    },
    {
      type: "string",
      label: "format-stop",
      name: "format-stop",
      placeholder: "--:--:--"
    }
  ]
};

import {
  Component,
  ValueHolder,
  RectPath,
  Shape,
  error
} from "@hatiolab/things-scene";

export default class Timer extends ValueHolder(RectPath(Shape)) {
  static get nature() {
    return NATURE;
  }

  dispose() {
    clearTimeout(this.timer);
    super.dispose();
  }

  ready() {
    if (!this.app.isViewMode) return;

    var { days, hours, minutes, seconds } = this.state;

    this.counts = this.calcToSeconds(
      days || 0,
      hours || 0,
      minutes || 0,
      seconds || 0
    );
    this.set(
      "data",
      format(this.counts * 1000, this.getState("format-run"))
    );

    if (this.counts) this.counting();
  }

  onchange(after) {
    if ("value" in after) {
      this.stopCounting();
      var milli = Number(after.value);
      this.counts = milli > 0 ? Math.floor(milli / 1000) : 0;
      this.counting();
    }
  }

  calcToSeconds(days, hours, minutes, seconds) {
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  counting() {
    this.stopCounting();
    this.timer = setTimeout(() => {
      this.counts--;
      this.set(
        "data",
        format(this.counts * 1000, this.getState("format-run"))
      );
      if (this.counts > 0) this.counting();
      else this.set("data", this.getState("format-stop"));
    }, 1000);
  }

  stopCounting() {
    clearTimeout(this.timer);
  }

  render(context) {
    var {
      top,
      left,
      height,
      width,
      backgroundColor = "transparent",
      reverse
    } = this.model;

    this.animOnValueChange(this.value);

    // background의 색상
    context.beginPath();
    context.rect(left, top, width, height);

    context.fillStyle = backgroundColor;
    context.fill();

    // value의 색상
    context.beginPath();

    var drawValue =
      width - (width * Math.max(Math.min(this.animValue, 100), 0)) / 100;
    drawValue = Math.max(Math.min(drawValue, width), 0);

    context.rect(left + drawValue, top, width - drawValue, height);

    this.drawFill(context);

    context.closePath();

    context.beginPath();

    context.rect(left, top, width, height);
  }

  postrender(context) {
    this.drawStroke(context);
    this.drawText(context);
  }

  get controls() {}
}

Component.register("timer", Timer);
