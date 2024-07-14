class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, color = "#000000") {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  isNear(x, y, radius = 5) {
    return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) < radius;
  }

  toString() {
    return `Point (${this.x}, ${this.y})`;
  }
}

class Polygon {
  constructor(id, points = [], isComplete = false) {
    this.id = id;
    this.points = points;

    if (isComplete) {
      if (this.points.length <= 2) {
        throw new Error("Invalid amount of points for a polygon");
      }
    }

    this.isComplete = false;
  }

  addPoint(point) {
    this.points.push(point);
  }

  setComplete() {
    this.isComplete = true;
  }

  draw(ctx) {
    ctx.beginPath();
    const color = this.isComplete ? "#00ff00" : "#ff0000";
    ctx.strokeStyle = color;

    for (let i = 0; i < this.points.length - 1; i++) {
      ctx.moveTo(this.points[i].x, this.points[i].y);
      ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
    }

    if (this.isComplete) {
      let pointEnd = this.points[this.points.length - 1];
      let pointStart = this.points[0];

      ctx.moveTo(pointEnd.x, pointEnd.y);
      ctx.lineTo(pointStart.x, pointStart.y);
    }

    ctx.stroke();

    this.points.forEach((point) => {
      point.draw(ctx, color);
    });
  }
}

class SidePanel {
  constructor() {
    this.domElement = document.getElementById("coordDiv");
    this.currentGroup = undefined;
  }

  newGroup(title) {
    this.currentGroup = document.createElement("div");
    const groupTitle = document.createElement("h3");
    groupTitle.append(title);
    this.currentGroup.appendChild(groupTitle);
    this.domElement.append(this.currentGroup);
  }

  endGroup() {
    this.currentGroup = undefined;
  }

  appendCurrentGroup(data) {
    if (!this.currentGroup) {
      throw new Error("No active group to append data");
    }

    const dataDiv = document.createElement("div");
    dataDiv.append(data);
    this.currentGroup.appendChild(dataDiv);
  }
}

class AppFrame {
  constructor() {
    this.canvas = document.getElementById("imgCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.img = new Image();
    this.img.src = "image.jpg";

    this.coordDiv = document.getElementById("coordDiv");
    this.sidePanel = new SidePanel();

    this.polygons = [];
    this.polygonsCounter = 0;
    this.currentPolygon = undefined;
    // this.currentPolygonDiv = undefined;

    this.img.onload = this.onImageLoad.bind(this);
    this.canvas.onclick = this.onClickHandler.bind(this);
    this.canvas.oncontextmenu = this.onRightClickHandler.bind(this);
  }

  startPolygon() {
    this.polygonsCounter++;
    this.currentPolygon = new Polygon();
    this.sidePanel.newGroup(`Polygon #${this.polygonsCounter}`);
  }

  endPolygon() {
    if (this.currentPolygon.points.length <= 2) {
      return;
    }

    this.currentPolygon.isComplete = true;
    this.currentPolygon.draw(this.ctx);
    this.polygons.push(this.currentPolygon);
    this.currentPolygon = undefined;
    this.sidePanel.endGroup();
  }

  onClickHandler(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = Math.floor(event.clientX - rect.left);
    let y = Math.floor(event.clientY - rect.top);

    console.log(`Coordinates: (${x}, ${y})`);

    if (!this.currentPolygon) {
      this.startPolygon();
    }

    const point = new Point(x, y);
    this.currentPolygon.addPoint(point);
    this.currentPolygon.draw(this.ctx);

    this.sidePanel.appendCurrentGroup(`(${x}, ${y})`);
  }

  onRightClickHandler(event) {
    event.preventDefault();
    this.endPolygon();
    return false;
  }

  onImageLoad(event) {
    const aspectRatio = this.img.width / this.img.height;
    const maxWidth = this.img.naturalWidth;
    const minWidth = 600;

    this.canvas.width = Math.max(minWidth, Math.min(maxWidth, 800));
    this.canvas.height = this.canvas.width / aspectRatio;

    this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
  }
}

window.onload = function() {
  new AppFrame();
};
