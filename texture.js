class GuaTexture extends GuaObject {
    constructor(pixels, width, height) {
        super()
        this.pixels = pixels
        this.width = width
        this.height = height
    }
    static fromGuaImage(image) {
        // image: String

        let lines = image.split('\n')
        let line
        // log('lines: ', lines)
        // file type
        lines.shift()
        // version
        lines.shift()

        // size meta
        line = lines.shift()
        let width = parseInt(line)
        line = lines.shift()
        let height = parseInt(line)
        // pixels
        let pixels = new Array(width * height)
        const delimiter = ' '
        for (let i = 0; i < height; i++) {
            line = lines.shift()
            let row = line.split(delimiter)
            for(let j = 0; j < width; j++) {
                let pixel = parseInt(row[j]).toString(16)
                // log('pixel: ', pixel)
                while (pixel.length < 8) {
                    pixel = '0' + pixel
                }
                // log('pixel: ', pixel)
                pixels[i * width + j] = pixel
            }
        }
        // log('pixels: ', pixels)
        let t = this.new(pixels, width, height)
        return t
    }
    sample(u, v) {
        let {pixels, width, height} = this
        // log('pixels: ', pixels)

        let abs = Math.abs
        let int = Math.floor

        // log('u, v: ', u, v)
        let tu = abs(int(u * (width - 1)))
        let tv = abs(int(v * (height - 1)))

        let index = tu + tv * width
        let pixel = pixels[index]
        // log('pixel: ', pixel)
        let c = GuaColor.newHex(pixel)
        return c
    }
}
