function* bubbleSort(props) {
    let { data } = props

    for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - i - 1; j++) {
            if(data[j].value > data[j + 1].value){
                let temp = data[j]
                data[j] = data[j + 1]
                data[j + 1] = temp
                
                data[j + 1].color = 1   
            }

            yield {
                j: [j + 1],
                step: (i + 1) * data.length + j + 1,
                resetColor: false
            }
        }

        data[data.length - i - 1].color = 3
    }
}

function* selectionSort(props) {
    let { data } = props

    for (let i = 0; i < data.length; i++) {
        let minIdx = i
        data[minIdx].color = 2

        if (i > 0)
            data[i - 1].color = 3

        for (let j = i + 1; j < data.length; j++) {
            if (data[minIdx].value > data[j].value) {
                data[minIdx].color = 0
                minIdx = j
            }

            data[j].color = 1
            
            yield {
                j: [j],
                step: (i + 1) * data.length + j + 1,
                resetColor: false
            }
            data[minIdx].color = 2
        }

        let temp = data[minIdx]
        data[i].color = 1
        data[minIdx] = data[i]
        data[i] = temp

        yield {
            j: [i, minIdx],
            step: (i + 1) * data.length,
            resetColor: false
        }
    }
}

function* insertionSort(props) {
    let { data } = props

    data[0].color = 3
    for (let i = 1; i < data.length; i++) {
        let j = i - 1
        let key = data[i]
        key.color = 1

        while (j >= 0 && data[j].value > key.value) {
            data[j + 1] = data[j]
            data[j] = key
            j--

            yield {
                j: [],
                step: 0,
                resetColor: false
            }
        }

        key.color = 3
    }
}

export default function getSorter(algo) {
    switch (algo) {
        case 'bs': 
            return bubbleSort
        case 'ss':
            return selectionSort
        case 'is':
            return insertionSort
        default:
            return bubbleSort
    }
}