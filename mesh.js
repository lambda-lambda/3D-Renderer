class GuaMesh extends GuaObject {
    constructor(position,scale) {
        //position\ scale : GuaVector
        super()
        this.position = position
        this.rotation = GuaVector.new(0, 0, 0)
        this.scale = scale
        this.vertices = null
        this.indices = null
        this.texture = null
    }
    fromGua3D(gua3d) {
        // gua3d: String
        let lines = gua3d.split('\n')
        // log('lines: ', lines)
        // file type
        lines.shift()
        // version
        lines.shift()
        // fomart meta
        let line = lines.shift()
        let numberOfVertices = parseInt(line.split(' ')[1])
        // log('numberOfVertices: ', numberOfVertices)
        line = lines.shift()
        let numberOfTriangles = parseInt(line.split(' ')[1])
        // log('numberOfTriangles: ', numberOfTriangles)

        let vertices = []
        for (let i = 0; i < numberOfVertices; i++) {
            let line = lines.shift()
            let items = line.split(' ')
            let [x, y, z] = items.slice(0, 3).map(n => parseFloat(n))
            let p = GuaVector.new(x, y, z)
            let [nx, ny, nz] = items.slice(3, 6).map(n => parseFloat(n))
            let n = GuaVector.new(nx, ny, nz)
            let [u, v] = items.slice(6, 8).map(n => parseFloat(n))
            let c = GuaColor.randomColor()
            let vertex = GuaVertex.new(p, c, n, u, v)
            // log('new vertex: ', vertex)
            vertices.push(vertex)
        }

        let indices = []
        for (let i = 0; i < numberOfTriangles; i++) {
            let line = lines.shift()
            let t = line.split(' ').map(n => parseInt(n))
            indices.push(t)
        }
        this.vertices = vertices
        this.indices = indices
        return this
    }
    cube() {
        // 8 points
        let points = [
            -1, 1,  -1,     // 0
            1,  1,  -1,     // 1
            -1, -1, -1,     // 2
            1,  -1, -1,     // 3
            -1, 1,  1,      // 4
            1,  1,  1,      // 5
            -1, -1, 1,      // 6
            1,  -1, 1,      // 7
        ]

        let vertices = []
        for (let i = 0; i < points.length; i += 3) {
            let v = GuaVector.new(points[i], points[i+1], points[i+2])
            // let c = GuaColor.randomColor()
            let c = GuaColor.red()
            vertices.push(GuaVertex.new(v, c))
        }

        // vertices[0].color = GuaColor.red()
        vertices[1].color = GuaColor.blue()
        // vertices[2].color = GuaColor.green()
        // vertices[3].color = GuaColor.red()
        // vertices[4].color = GuaColor.blue()
        // vertices[5].color = GuaColor.green()
        vertices[6].color = GuaColor.green()
        // vertices[7].color = GuaColor.blue()

        // 12 triangles * 3 vertices each = 36 vertex indices
        let indices = [
            // 12
            [0, 1, 2],
            [1, 3, 2],
            [1, 7, 3],
            [1, 5, 7],
            [5, 6, 7],
            [5, 4, 6],
            [4, 0, 6],
            [0, 2, 6],
            [0, 4, 5],
            [5, 1, 0],
            [2, 3, 7],
            [2, 7, 6],
        ]
        let m = this.new()
        m.vertices = vertices
        m.indices = indices
        return m
    }

        // 球
    sphere(h = 8) {
        let m = this
        let vertices = []
        let indices = []
        let w = 2 * h
        let r = 1
        let color = GuaColor.white()
        let index = 0
        let grid = []
        let pi = Math.PI
        for (let iy = 0; iy <= h; iy++) {
            let v = iy / h
            let row = []
            for (let ix = 0; ix <= w; ix++) {
                let u = ix / w
                let x = - r * Math.cos(u * 2 * pi) * Math.sin(v * pi)
                let y = r * Math.cos(v * pi)
                let z = r * Math.sin(u * 2 * pi) * Math.sin(v * pi)
                let p = GuaVector.new(x, y, z)
                let n = p.normalize()
                let vertex = GuaVertex.new(p, color, n, u, v)
                vertices.push(vertex)
                row.push(index)
                index++
            }
            grid.push(row)
        }
        for (let iy = 0; iy < h; iy++) {
            for (let ix = 0; ix < w; ix++) {
                let a = grid[iy][ix + 1]
                let b = grid[iy][ix]
                let c = grid[iy + 1][ix]
                let d = grid[iy + 1][ix + 1]

                if (iy !== 0) {
                    indices.push([a, b, d])
                }

                if (iy !== h - 1) {
                    indices.push([b, c, d])
                }
            }
        }
        m.vertices = vertices
        m.indices = indices
        // log(m.vertices.length, m.indices.length)

        return m
    }
}
