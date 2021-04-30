
// 单例。使用model 存储数据， 和数据计算

import {MapNodeData, MapConfig} from "./MapConfig";
import {getIndexByIJ, getIJByIndex} from "./GolbalFunc"

export default class MapModel{
    private static __instance:MapModel = null
    private constructor()
    {

    }
    public static getInstance()
    {
        if(!MapModel.__instance)
        {
            MapModel.__instance = new MapModel()
        }

        try {
            !MapModel.__instance
        } catch (error) {
            cc.log("------------MapModel.__instance-----------------", MapModel.__instance)
        }
        
        return MapModel.__instance
    }

    public checkList:Array<number> = []

    public map_list:Array<Array<MapNodeData.MapData>> = [];

    reserMapList()
    {
        for(let i:number = 0; i < MapConfig.max_row; i++)
        {
            this.map_list[i] = []
        }
    }

    updateMapWithIndex(index:number, mapData:MapNodeData.MapData)
    {
        let p = getIJByIndex(index)
        this.updateMapWithIJ(p, mapData)
    }

    updateMapWithIJ(p:cc.Vec2, mapData:MapNodeData.MapData)
    {
        this.map_list[p.x][p.y] = mapData
    }

    checkNear(pos:cc.Vec2):Array<number>
    {

        let checkList:Array<number> = []

        checkList.push(getIndexByIJ(pos.x, pos.y))

        this.checkSameType(pos, checkList)


        return checkList
    }

    // 查看相同的type
    checkSameType(pos:cc.Vec2, checkList:Array<number>)
    {
        let i = pos.x
        let j = pos.y

        let tempType:MapNodeData.mapdataEnum = this.map_list[i][j].dataType

        // 四方向寻找
        let path_fir:Array<cc.Vec2> = [
            cc.v2(0, 1),
            cc.v2(1, 0),
            cc.v2(-1, 0),
            cc.v2(0, -1)
        ]
        
        for(let k = 0; k < 4 ; k++)
        {   
            let px = i + path_fir[k].x
            let py = j + path_fir[k].y

            if(px >= 0 && px < MapConfig.max_col && py >= 0 && py < MapConfig.max_row)
            {
                if(tempType == this.map_list[px][py].dataType)
                {   
                    let index = getIndexByIJ(px, py)
                    let check = false
                   // 检测是否已经有了。
                    for(let z = 0; z < checkList.length; z++)
                    {
                        if(checkList[z] == index)
                        {
                            check = true
                            break;
                        }
                    }
                    // 添加到列表里面
                   if(!check)
                   {
                        checkList.push(index)
                        // 继续判断
                        this.checkSameType(cc.v2(px, py), checkList)
                   }
                }
            }
        }
    }


    setmaptype(p:cc.Vec2, _type:MapNodeData.mapdataEnum)
    {
        this.map_list[p.x][p.y].dataType = <MapNodeData.mapdataEnum>_type
    }
    


}
