
import {MapNodeData,MapConfig} from "./MapConfig"
const getIndexByIJ = function(i:number, j:number):number
{
    let num:number = (i)*MapConfig.max_col + j;

    return num;
}


const getIJByIndex = function(index:number|string):cc.Vec2
{
    let num = Number(index);
    let x = 0;
    let y = 0;

    if (typeof(num) == "number")
    {
        x = Math.floor(num / MapConfig.max_row);
        y = Math.floor(num % MapConfig.max_row);
    }
    
    return cc.v2(x, y);
}

const FindNearNode = function(index)
{

}


export {getIndexByIJ, getIJByIndex,FindNearNode};