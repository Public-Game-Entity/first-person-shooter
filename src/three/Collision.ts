

type AABBType = {
    box1: { 
        minX: number, minY: number, maxX: number, maxY: number, minZ: number,  maxZ: number
    }, 
    box2: { 
        minX: number, minY: number, maxX: number, maxY: number, minZ: number,  maxZ: number
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


        // return (
        //     box1.minX <= box2.maxX &&
        //     box1.maxX >= box2.minX &&
        //     box1.minZ <= box2.maxZ &&
        //     box1.maxZ >= box2.minZ &&
        //     box1.minY <= box2.maxY &&
        //     box1.maxY >= box2.minY
        // );

        // box1.maxX < box2.minX || 
        // box1.minX > box2.maxX || 

        // box1.maxZ < box2.minZ || 
        // box1.minZ > box2.maxZ || 

        // box1.maxY < box2.minY || 
        // box1.minY > box2.maxY


        if (box1.maxX < box2.minX || box1.minX > box2.maxX) return false;
        if (box1.maxY < box2.minY || box1.minY > box2.maxY) return false;
        if (box1.maxZ < box2.minZ || box1.minZ > box2.maxZ) return false;
        return true;
        

        if (box1.minX <= box2.maxX && box1.maxX >= box2.minX &&
            box1.minZ <= box2.maxZ && box1.maxZ >= box2.minZ &&
            box1.minY <= box2.maxY && box1.maxY >= box2.minY) {
            return false
        }

        return true
    }
}

export { Collision }