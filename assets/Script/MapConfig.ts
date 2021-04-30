// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


namespace MapNodeData{

    export enum mapdataEnum{
        none,
        type1,
        type2,
        type3,
        type4,
        type5,
        type6,
        type7,

    }
    export class MapData{
        private _index:number = 0;
        private _dataType:mapdataEnum = 0;
        private _node:cc.Node = null;
        constructor(_index:number, data:mapdataEnum)
        {   
            this.index = _index
            this.dataType = data
        }

        set index(__index){
            this._index = __index;
        }
        get index()
        {
            return this._index
        }
        set dataType(value)
        {
            this._dataType = value
        }
        get dataType()
        {
            return this._dataType
        }

        set node(value:cc.Node)
        {
            this._node = value
        }

        get node()
        {
            return this._node
        }
    }
    // Lv:Array<Array<Number>> = []

}

class MapConfig{
    
    static max_col:number = 7;
    static max_row:number = 7;

    static cell_height:number = 78;
    static cell_width:number = 78;

    // 起始点
    static begin_pos:cc.Vec2 = cc.v2(78/2+50, 78/2+50)

}





export{MapNodeData, MapConfig}
