<!--
This component is a modification of <el-progress> from ElemeFE.

-- Original License --
The MIT License (MIT)

Copyright (c) 2016-present ElemeFE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-- End of Original License --
-->
<template>
  <div
    class="el-progress"
    :class="[
      'el-progress--' + type,
      status ? 'is-' + status : '',
      {
        'el-progress--without-text': !showText,
        'el-progress--text-inside': textInside,
      }
    ]"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="el-progress-bar" v-if="type === 'line'">
      <div class="el-progress-bar__outer" :style="{height: strokeWidth + 'px'}">
        <div class="el-progress-bar__inner" :style="barStyle">
          <div class="el-progress-bar__innerText" v-if="showText && textInside">{{content}}</div>
        </div>
      </div>
    </div>
    <div class="el-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
      <svg viewBox="0 0 100 100">
        <path
          class="el-progress-circle__track"
          :d="trackPath"
          stroke="#e5e9f2"
          :stroke-width="relativeStrokeWidth"
          fill="none"
          :style="trailPathStyle"
        />
        <path
          class="el-progress-circle__path"
          :d="trackPath"
          :stroke="stroke"
          fill="none"
          stroke-linecap="round"
          :stroke-width="percentage ? relativeStrokeWidth : 0"
          :style="circlePathStyle"
        />
      </svg>
    </div>
    <div
      class="el-progress__text"
      v-if="showText && !textInside"
      :style="{fontSize: progressTextSize + 'px'}"
    >
      <template v-if="!status">{{content}}</template>
      <i v-else :class="iconClass"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "NeoProgress",
  props: {
    type: {
      type: String,
      default: "line",
      validator: val => ["line", "circle", "dashboard"].indexOf(val) > -1
    },
    now: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 
    },
    total: {
      type: Number,
      default: 100,
      validator: val => val > 0
    },
    status: {
      type: String,
      validator: val => ["success", "exception", "warning"].indexOf(val) > -1
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    textInside: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 126
    },
    showText: {
      type: Boolean,
      default: true
    },
    color: {
      type: [String, Array, Function],
      default: ""
    },
    format: Function
  },
  computed: {
    percentage() {
      return this.now / this.total * 100;
    },
    barStyle() {
      const style = {};
      style.width = this.percentage + "%";
      style.backgroundColor = this.getCurrentColor(this.percentage);
      return style;
    },
    relativeStrokeWidth() {
      return ((this.strokeWidth / this.width) * 100).toFixed(1);
    },
    radius() {
      if (this.type === "circle" || this.type === "dashboard") {
        return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);
      } else {
        return 0;
      }
    },
    trackPath() {
      const radius = this.radius;
      const isDashboard = this.type === "dashboard";
      return `
          M 50 50
          m 0 ${isDashboard ? "" : "-"}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "" : "-"}${radius * 2}
          `;
    },
    perimeter() {
      return 2 * Math.PI * this.radius;
    },
    rate() {
      return this.type === "dashboard" ? 0.75 : 1;
    },
    strokeDashoffset() {
      const offset = (-1 * this.perimeter * (1 - this.rate)) / 2;
      return `${offset}px`;
    },
    trailPathStyle() {
      return {
        strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset
      };
    },
    circlePathStyle() {
      return {
        strokeDasharray: `${this.perimeter *
          this.rate *
          (this.percentage / 100)}px, ${this.perimeter}px`,
        strokeDashoffset: this.strokeDashoffset,
        transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease"
      };
    },
    stroke() {
      let ret;
      if (this.color) {
        ret = this.getCurrentColor(this.percentage);
      } else {
        switch (this.status) {
          case "success":
            ret = "#13ce66";
            break;
          case "exception":
            ret = "#ff4949";
            break;
          case "warning":
            ret = "#e6a23c";
            break;
          default:
            ret = "#20a0ff";
        }
      }
      return ret;
    },
    iconClass() {
      if (this.status === "warning") {
        return "el-icon-warning";
      }
      if (this.type === "line") {
        return this.status === "success"
          ? "el-icon-circle-check"
          : "el-icon-circle-close";
      } else {
        return this.status === "success" ? "el-icon-check" : "el-icon-close";
      }
    },
    progressTextSize() {
      return this.type === "line"
        ? 12 + this.strokeWidth * 0.4
        : this.width * 0.111111 + 2;
    },
    content() {
      if (typeof this.format === "function") {
        return this.format(this.now/ this.total) || "";
      } else {
        return `${this.now}/${this.total}`;
      }
    }
  },
  methods: {
    getCurrentColor(percentage) {
      if (typeof this.color === "function") {
        return this.color(percentage);
      } else if (typeof this.color === "string") {
        return this.color;
      } else {
        return this.getLevelColor(percentage);
      }
    },
    getLevelColor(percentage) {
      const colorArray = this.getColorArray().sort(
        (a, b) => a.percentage - b.percentage
      );
      for (let i = 0; i < colorArray.length; i++) {
        if (colorArray[i].percentage > percentage) {
          return colorArray[i].color;
        }
      }
      return colorArray[colorArray.length - 1].color;
    },
    getColorArray() {
      const color = this.color;
      const span = 100 / color.length;
      return color.map((seriesColor, index) => {
        if (typeof seriesColor === "string") {
          return {
            color: seriesColor,
            progress: (index + 1) * span
          };
        }
        return seriesColor;
      });
    }
  }
};
</script>