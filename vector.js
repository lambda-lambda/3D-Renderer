class GuaVector extends GuaObject {
    constructor(x, y, z) {
        super()
        this.x = x
        this.y = y
        this.z = z
    }
    interpolate(other, factor) {
        let p1 = this
        let p2 = other
        let x = p1.x + (p2.x - p1.x) * factor
        let y = p1.y + (p2.y - p1.y) * factor
        let z = p1.z + (p2.z - p1.z) * factor
        return GuaVector.new(x, y, z)
    }
    toString() {
        let s = ''
        s += this.x.toFixed(3)
        s += this.y.toFixed(3)
        s += this.z.toFixed(3)
        return s
    }
    multi_num(n) {
        return GuaVector.new(this.x * n, this.y * n, this.z * n)
    }
    sub(v) {
        let x = this.x - v.x
        let y = this.y - v.y
        let z = this.z - v.z
        return GuaVector.new(x, y, z)
    }
    add(v) {
        let x = this.x + v.x
        let y = this.y + v.y
        let z = this.z + v.z
        return GuaVector.new(x, y, z)
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    normalize() {
        let l = this.length()
        if (l == 0) {
            return this
        }
        let factor = 1 / l

        return this.multi_num(factor)
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }
    cross(v) {
        let x = this.y * v.z - this.z * v.y
        let y = this.z * v.x - this.x * v.z
        let z = this.x * v.y - this.y * v.x
        return GuaVector.new(x, y, z)
    }





// cos_value = a.dot(b) / (a.length() * b.length())

    static  core(a, b, c) {
        let x = (a.x + b.x + c.x) / 3
        let y = (a.y + b.y + c.y) / 3
        let z = (a.z + b.z + c.z) / 3
        return GuaVector.new(x, y, z)
    }
}
