if (!window._e) {
    window._e = document.querySelector.bind(document)
}
if (!window._ce) {
    window._ce = document.createElement.bind(document)
}

class Slider {
    static new(...args) {
        return new this(...args)
    }

    /**
     * 
     * @param {string} selector 
     * @param {object} options 
     * @param {number} options.min 
     * @param {number} options.max 
     * @param {number=} options.value 
     * @param {number=} options.width 
     * @param {string} options.title 
     * @param {boolean=} options.persist 
     */
    constructor(selector, options) {
        let { min, max, value = min } = options
        if (value < min) {
            value = min
        } else if (value > max) {
            value = max
        }

        this.handlers = {}
        this.options = {
            width: 300,
            step: 1.5,
            ...options,
            value,
        }
        this.attach(selector)
    }

    attach(selector = 'body') {
        let ctn = _e(selector)
        let { title } = this.options

        /** @type {HTMLElement} */
        let wrapper = _ce('div')
        wrapper.className = 'slider'
        wrapper.insertAdjacentHTML('beforeend', `
            <div class="text">
                <div class="value"></div>
                <div class="title">${title}</div>
            </div>
            <div class="main">
                <div class="outer">
                    <div class="inner">
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        `)

        this.bindEvents(wrapper)

        ctn.appendChild(wrapper)
    }

    bindEvents(el) {
        let e = el.querySelector.bind(el)
        let inner = e('.inner')
        let dot = e('.dot')
        let { min, max, value, width, persist } = this.options

        el.style.width = `${width}px`
        let maxOffset = width

        let moving = false

        let total = max - min
        let offset = 0
        let result = e('.value')
        let unit = width / total

        const updateValue = (value, publish) => {
            let percentage = value / total
            inner.style.width = String(percentage * 100) + '%'

            let actualValue = value + min
            result.innerHTML = actualValue

            if (publish) {
                this.trigger(Slider.events.CHANGE, actualValue)
            }
        };

        updateValue(value - min)

        const updateByOffset = (x, publish) => {

            if (x > maxOffset) {
                x = maxOffset
            }
            if (x < 0) {
                x = 0
            }

            x = Math.round(x / unit)
            
            updateValue(x, publish)
        }

        dot.addEventListener('mousedown', (event) => {
           
            offset = event.clientX - dot.offsetLeft - dot.offsetWidth / 2
            moving = true
        })

        document.addEventListener('mouseup', (event) => {
            if (!persist && moving) {
               
                updateByOffset(event.clientX - offset, true)
            }
            moving = false
        })

        document.addEventListener('mousemove', (event) => {
            if (moving) {
                updateByOffset(event.clientX - offset, persist)
            }
        })
    }

    trigger(eventName, ...args) {
        let hs = this.handlers[eventName]
        if (hs) {
            for (let handler of hs) {
                handler(...args)
            }
        }
    }

    on(eventName, fn) {
        let hs = this.handlers
        hs[eventName] = hs[eventName] || []
        hs[eventName].push(fn)
        return this
    }
}

Slider.events = {
    CHANGE: 'change',
}
