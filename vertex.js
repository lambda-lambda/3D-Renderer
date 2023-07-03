class GuaVertex extends GuaObject {
    
    constructor(position, color, normal, u, v) {
        // u: float
        // v: float
        super()
        this.position = position
        this.color = color
        this.normal = normal
        this.u = u
        this.v = v
    }
    interpolate(other, factor) {
        let a = this
        let b = other
        //log('a, b', a, b)
        let p = a.position.interpolate(b.position, factor)
        let c = a.color.interpolate(b.color, factor)
        let n = a.normal.interpolate(b.normal, factor)
        let tu = interpolate(a.u, b.u, factor)
        let tv = interpolate(a.v, b.v, factor)
        // log('p, c, n, tu, tv: ', p, c, n, tu, tv)
        return GuaVertex.new(p, c, n, tu, tv)
    }
}
