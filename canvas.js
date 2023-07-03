class GuaCamera extends GuaObject {
    constructor() {
        super()
        this.position = GuaVector.new(0, 0, -10)
        this.target = GuaVector.new(0, 0, 0)
        this.up = GuaVector.new(0, 1, 0)
    }
}

class GuaCanvas extends GuaObject {
    constructor(selector) {
        super()
        let canvas = _e(selector)
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        // this.pixelBuffer = this.pixels.data
        this.camera = GuaCamera.new()
        // z-buffer
        this._resetZBuffer()

        this.light = GuaVector.new(4, -3, 0)
    }
    render() {
       
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }
    clear(color=GuaColor.transparent()) {
        // color GuaColor
       
        let {w, h} = this
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, color)
            }
        }
        this._resetZBuffer()
        this.render()
    }
    _getPixel(x, y) {
        let int = Math.floor
        x = int(x)
        y = int(y)
        let i = (y * this.w + x) * this.bytesPerPixel
        let p = this.pixels.data
        return GuaColor.new(p[i], p[i+1], p[i+2], p[i+3])
    }
    _setPixel(x, y, color) {
        
        let int = Math.round
        x = int(x)
        y = int(y)
        let i = (y * this.w + x) * this.bytesPerPixel
        let p = this.pixels.data
        let {r, g, b, a} = color
        p[i] = int(r)
        p[i+1] = int(g)
        p[i+2] = int(b)
        p[i+3] = int(a)
    }
    _resetZBuffer() {
        let {w, h} = this
        var a = new Array(w);
        for (let i = 0; i < w; i++) {
          a[i] = new Array(h);
          for (let j = 0; j < h; j++) {
            a[i][j] = null
          }
        }
        this.zBuffer = a
    }
    drawPoint(point, color=GuaColor.black()) {
        // point: GuaVector
        let {w, h} = this
        let {x, y, z} = point
        let int = Math.round
        x = int(x)
        y = int(y)
        if (x < 0 || x >= w || y < 0 || y >= h) {
            return
        }
        let depth = this.zBuffer[x][y]
        // log('depth: ', depth, 'z: ', z)
        if (depth != null && depth < z) {
            return
        }
        this.zBuffer[x][y] = z
        this._setPixel(x, y, color)
    }
    drawLine(p1, p2, color=GuaColor.white()) {
        let [x1, y1, x2, y2] = [p1.x, p1.y, p2.x, p2.y]
        let dx = x2 - x1
        let dy = y2 - y1
        let R = (dx ** 2 + dy ** 2) ** 0.5
        let ratio = dx === 0 ? undefined : dy / dx
        let angle = 0
        if (ratio === undefined) {
            const p = Math.PI / 2
            angle = dy >= 0 ? p : -p
        } else {
            const t = Math.abs(dy / R)
            const sin = ratio >= 0 ? t : -t
            const asin = Math.asin(sin)
            angle = dx > 0 ? asin : asin + Math.PI
        }
        for (let r = 0; r <= R; r++) {
            const x = x1 + Math.cos(angle) * r
            const y = y1 + Math.sin(angle) * r
            this._setPixel(x, y, color)

            //this.drawPoint(GuaVector.new(x, y, 0.1), color)
        }
    }
    drawScanline(v1, v2, texture,lightFactor) {
        let [a, b] = [v1, v2].sort((va, vb) => va.position.x - vb.position.x)
        let y = a.position.y
        let x1 = a.position.x
        let x2 = b.position.x
        for (let x = x1; x <= x2; x++) {
            let factor = 0
            if (x2 != x1) {
                factor = (x - x1) / (x2 - x1);
            }
            let v = a.interpolate(b, factor)
            let {position: p, color: c, u: vu, v: vv} = v

            c = GuaColor.white()

           
            if (texture != undefined){
                c = texture.sample(vu, vv)
            }

            if (lightFactor) {
                c.r *= lightFactor
                c.g *= lightFactor
                c.b *= lightFactor
            }

            this.drawPoint(GuaVector.new(p.x, y, p.z), c)
        }
    }
    drawTriangle(v1, v2, v3, texture,lightFactor) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
        // log(a, b, c)
        let middle_factor = 0
        if (c.position.y - a.position.y != 0) {
            middle_factor = (b.position.y - a.position.y) / (c.position.y - a.position.y)
        }
        let middle = a.interpolate(c, middle_factor)

        let start_y = a.position.y
        let end_y = b.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(middle, factor)
            let vb = a.interpolate(b, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb, texture,lightFactor)
        }

        start_y = b.position.y
        end_y = c.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = middle.interpolate(c, factor)
            let vb = b.interpolate(c, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb, texture,lightFactor)
        }
    }
    project(coordVector, transformMatrix) {
        let {w, h} = this
        let [w2, h2] = [w/2, h/2]
        let point = transformMatrix.transform(coordVector.position)
        let x = point.x * w2 + w2
        let y = - point.y * h2 + h2

        let z = point.z
        let v = GuaVector.new(x, y, z)
        let {color, normal, u: cu, v: cv} = coordVector
        return GuaVertex.new(v, color, normal, cu, cv)
    }
    drawMesh(mesh) {
        
        let self = this
        // camera
        let {w, h} = this
        let {position, target, up} = self.camera
        const view = Matrix.lookAtLH(position, target, up)
        // field of view
        const projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1)

        const rotation = Matrix.rotation(mesh.rotation)
        //log("mesh.position", mesh.position.x)
        const translation = Matrix.translation(mesh.position)
        const scale = Matrix.scale(mesh.scale)
        const world = scale.multiply(rotation.multiply(translation))

        const transform = world.multiply(view).multiply(projection)

        const viewAndproject = view.multiply(projection)

        let [targetFake, upFake] = [target, up]
        let positionFake = GuaVector.new(position.x, position.y, position.z, position.w)
        positionFake.x = -10
        positionFake.y = 0
        positionFake.z = 0
        const viewFake = Matrix.lookAtLH(positionFake, targetFake, upFake)
        const projectionFake = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1)
        const rotationFake = Matrix.rotation(mesh.rotation)
        const translationFake = Matrix.translation(mesh.position)
        const worldFake = rotationFake.multiply(translationFake)
        const transformFake = worldFake.multiply(viewFake).multiply(projectionFake)

        for (let t of mesh.indices) {
            let [a, b, c] = t.map(i => mesh.vertices[i])
            if (this.isBack(a,b,c,rotation)) {

                
                let position_core = GuaVector.core(a.position, b.position, c.position)
                let core = world.transform(position_core)

                position_core = world.transform(position_core).normalize()
                
                let normal_core = GuaVector.core(a.normal, b.normal, c.normal)
                normal_core = world.transform(normal_core).normalize()


                let l = this.light
                let light = this.light.normalize()
                let lightVector = position_core.sub(light).normalize()
                let angle = lightVector.dot(normal_core)

                let lightFactor = Math.max(0, angle)


                let [v1, v2, v3] = [a, b, c].map(v => self.project(v, transform))
                self.drawTriangle(v1, v2, v3, mesh.texture, lightFactor)
                // self.drawLine(v1.position, v2.position)
                // self.drawLine(v1.position, v3.position)
                // self.drawLine(v2.position, v3.position)


                
                // log('transformFake', transformFake, [a, b, c], [v1, v2, v3])
                let [v11, v22, v33] = [a, b, c].map(v => self.project(v, transformFake))
                v11.position.y += h/2
                v22.position.y += h/2
                v33.position.y += h/2
                self.drawTriangle(v11, v22, v33, mesh.texture, lightFactor)

                let [core1] = [GuaVertex.new(core)].map(v => self.project(v, transform))
                let [l1] = [GuaVertex.new(l)].map(v => self.project(v, viewAndproject))
                //self.drawLine(l1.position, core1.position)

            }
        }
    }

    isBack(v1, v2, v3, rotation) {
        let normal = GuaVector.core(v1.normal, v2.normal, v3.normal)
        // const [a, b, c] = [v1, v2, v3].map(v => world.transform(v.normal))
        normal = rotation.transform(normal).normalize()
        const direction = this.camera.position.sub(this.camera.target).normalize()
        const cos = direction.dot(normal)
        return cos < 0
    }

   




}
