class Drawable {
  construct(id) {
    this.id = id;
  }

  addPoint(point) {
    this.points.push(point);
  }

  setComplete() {
    this.isComplete = true;
  }

  draw(ctx) {
    console.log("This should be implemented in a subclass");
  }

  getConfigString() {
    console.log("This should be implemented in a subclass");
  }
}

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

class Arrow {
  constructor(point1, point2) {
    this.x1 = point1.x;
    this.y1 = point1.y;
    this.x2 = point2.x;
    this.y2 = point2.y;
  }

  draw(ctx, color = "#000000", head = true) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    // ctx.arc(this.x2, this.y2, 5, 0, 2 * Math.PI);
    // ctx.fill();

    if (head) {
      const headlen = 20; // length of head in pixels
      const angle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
      ctx.beginPath();
      ctx.moveTo(this.x2, this.y2);
      ctx.lineTo(
        this.x2 - headlen * Math.cos(angle - Math.PI / 6),
        this.y2 - headlen * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        this.x2 - headlen * Math.cos(angle + Math.PI / 6),
        this.y2 - headlen * Math.sin(angle + Math.PI / 6),
      );
      ctx.lineTo(this.x2, this.y2);
      ctx.lineTo(
        this.x2 - headlen * Math.cos(angle - Math.PI / 6),
        this.y2 - headlen * Math.sin(angle - Math.PI / 6),
      );
      ctx.stroke();
      ctx.fill();
    }
  }

  toString() {
    return `Arrow (${this.x1}, ${this.y1}) to (${this.x2, this.y2})`;
  }
}

class Polygon extends Drawable {
  constructor(id, points = [], isComplete = false) {
    super(id);
    this.id = id;
    this.points = points;

    if (isComplete) {
      if (this.points.length <= 2) {
        throw new Error("Invalid amount of points for a polygon");
      }
    }

    this.isComplete = isComplete;
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

  getConfigString(xScale = 0, yScale = 0) {
    let roi = `roi-P${this.id}=`;
    this.points.forEach((point) => {
      console.log(point);
      const x = Math.floor(point.x * xScale);
      const y = Math.floor(point.y * yScale);
      roi += `${x};${y};`;
    });
    console.log(roi);
    return roi;
  }

  toString() {
    let pointsStr = this.points.reduce((acc, currentVal, index, array) => {
      if (index < this.points.length - 1) {
        return acc + currentVal + ", ";
      } else {
        return acc + currentVal;
      }
    }, "");
    return `Polygon (id: ${this.id}, points: ${pointsStr}, isComplete: ${this.isComplete})`;
  }
}

class LineCrossing extends Drawable {
  static isValid(points) {
    return points.length = 4;
  }

  constructor(id, points = [], isComplete = false) {
    super(id);
    this.id = id;
    this.points = points;

    if (isComplete) {
      if (!LineCrossing.isValid(points)) {
        throw new Error("Created Line Crossing is invalid!");
      }
    }
    this.isComplete = isComplete;
  }

  addPoint(point) {
    if (this.points.length == 4) {
      throw new Error("Line Crossing can only have 4 points");
    }
    this.points.push(point);
    if (this.points.length == 4) {
      this.setComplete();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    const color = this.isComplete ? "#00ff00" : "#ff0000";
    ctx.strokeStyle = color;

    if (this.points.length >= 2) {
      let arrow = new Arrow(this.points[0], this.points[1]);
      arrow.draw(ctx, color, false);
    }

    if (this.points.length >= 4) {
      let arrow = new Arrow(this.points[2], this.points[3]);
      arrow.draw(ctx, color);
    }

    this.points.forEach((point) => {
      point.draw(ctx, color);
    });
  }

  getConfigString(xScale = 0, yScale = 0) {
    let lc = `line-crossing-P${this.id}=`;
    let reorderedPoints = [
      this.points[2],
      this.points[3],
      this.points[0],
      this.points[1],
    ];
    reorderedPoints.forEach((point) => {
      console.log(point);
      const x = Math.floor(point.x * xScale);
      const y = Math.floor(point.y * yScale);
      lc += `${x};${y};`;
    });
    console.log(lc);
    return lc;
  }
}
