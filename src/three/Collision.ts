

type AABBType = {
    box1: { 
        minX: number, minY: number, maxX: number, maxY: number
    }, 
    box2: { 
        minX: number, minY: number, maxX: number, maxY: number
    }

}

class Collision {
    constructor() {

    }

    public checkAABB({ box1, box2 }: AABBType) {
        // box1.maxX > box2.minX &&
        //     box1.minX < box2.maxX &&
        //     box1.maxY > box1.minY &&
        //     box1.minY < box2.maxY



        if (box1.maxX < box2.minX || 
            box1.maxY < box2.minY || 
            box1.minX > box2.maxX || 
            box1.minY > box2.maxY) {
            return false
        }

        return true
    }
}

export { Collision }