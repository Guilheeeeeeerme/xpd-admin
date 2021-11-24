const customMeasures = {
    torque: {
        systems: {
            metric: {
                Nm: {
                    name: {
                        singular: 'Newton metre',
                        plural: 'Newton metres'
                    },
                    to_anchor: 1
                },
                kNm: {
                    name: {
                        singular: 'KiloNewton metre',
                        plural: 'KiloNewtons metre'
                    },
                    to_anchor: 1000
                }
            },
            imperial: {
                lbfft: {
                    name: {
                        singular: 'Pound-force foot',
                        plural: 'Pound-force feet'
                    }
                    , to_anchor: 1
                },
                lbfin: {
                    name: {
                        singular: 'Pound-force inch',
                        plural: 'Pound-force inches'
                    },
                    to_anchor:  0.083333333558818
                }
            }
        },
        anchors: {
            metric: {
                imperial: {
                    ratio: 0.73756214927727
                }
            },
        }
    }

}

module.exports = customMeasures;