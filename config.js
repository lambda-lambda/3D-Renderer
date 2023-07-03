const config = {
    camera_position_x: {
        value: 0,
        title: 'Camera Position X',
        max: 10,
        min: -10,
    },
    camera_position_y: {
        value: 0,
        title: 'Camera Position Y',
        max: 10,
        min: -10,
    },
    camera_position_z: {
        value: -10,
        title: 'Camera Position Z',
        max: 10,
        min: -10,
    },
    camera_target_x: {
        value: 0,
        title: 'Camera Target X',
        max: 10,
        min: -10,
    },
    camera_target_y: {
        value: 0,
        title: 'Camera Target Y',
        max: 10,
        min: -10,
    },
    camera_target_z: {
        value: 0,
        title: 'Camera Target Z',
        max: 10,
        min: -10,
    },
    camera_up_x: {
        value: 0,
        title: 'Camera Up X',
        max: 10,
        min: -10,
    },
    camera_up_y: {
        value: 1,
        title: 'Camera Up Y',
        max: 10,
        min: -10,
    },
    camera_up_z: {
        value: 0,
        title: 'Camera Up Z',
        max: 10,
        min: -10,
    },

    mesh_position_x: {
        value: 0,
        title: 'Mesh Positon X',
        max: 10,
        min: -10,
    },
    mesh_position_y: {
        value: 0,
        title: 'Mesh Positon Y',
        max: 10,
        min: -10,
    },
    mesh_position_z: {
        value: 0,
        title: 'Mesh Positon Z',
        max: 10,
        min: -10,
    },
    rotation_x: {
        value: 0,
        title: 'Rotation X',
        max: 10,
        min: -10,
    },
    rotation_y: {
        value: 0,
        title: 'Rotation Y',
        max: 10,
        min: -10,
    },
    rotation_z: {
        value: 0,
        title: 'Rotation Z',
        max: 10,
        min: -10,
    },
    scale_x: {
        value: 1,
        title: 'Scale X',
        max: 10,
        min: 0,
    },
    scale_y: {
        value: 1,
        title: 'Scale Y',
        max: 10,
        min: 0,
    },
    scale_z: {
        value: 0,
        title: 'Scale Z',
        max: 10,
        min: 0,
    },

    light_x: {
        value: -2,
        title: 'light point x',
        max: 10,
        min: -10,
    },
    light_y: {
        value: 0,
        title: 'light point y',
        max: 10,
        min: -10,
    },
    light_z: {
        value: 4,
        title: 'light point z',
        max: 10,
        min: -10,
    },
}

const initSliders = () => {
    let width = _e('#id-canvas').clientWidth
    let el = _e('.config')
    el.style.width = width + 'px'
    let t = ''
    for (let [k, v] of Object.entries(config)) {
        let s = `
            <div>
                <span>${v.title}</span>
                <input 
                    class='config-range'
                    type="range" 
                    name="${k}"
                    value="${v.value}"
                    max="${v.max}"
                    min="${v.min}"
                    min="${v.min}"
                    step="${v.step || 0.1}"
                />
            </div>
        `
        t += s
    }
    el.innerHTML = t
    let range = _es('.config-range')
    range.forEach(item => {
        item.addEventListener('input', e => {
            let k = e.target.name
            config[k].value = e.target.value
            //return config

        })
    })

}
