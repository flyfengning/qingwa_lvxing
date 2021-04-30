// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {MapNodeData, MapConfig} from "./MapConfig";
import {getIndexByIJ, getIJByIndex} from "./GolbalFunc"

import MapModel from "./MapModel"

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    map_node:cc.Prefab = null;

    @property(cc.Layout)
    map_cell:cc.Layout = null;

    @property(cc.Prefab)
    rect_node:cc.Prefab = null;

    @property(cc.Node)
    bg:cc.Node = null;

    public max_type:number = 6;

    public m_model:MapModel = MapModel.getInstance();

    // @property 
    // public map_list:Array<Array<MapNodeData.MapData>> = [];

    public map_list_node:Array<Array<cc.Node>> = []

    start () {
        this.initMap();
        this.loadMap(1);
    }

    getPos(p:cc.Vec2):cc.Vec2
    {
        let size = this.map_cell.node.getContentSize()
        let px = p.x*MapConfig.cell_width - size.width / 2 + MapConfig.cell_width / 2
        let py = p.y*MapConfig.cell_height - size.height / 2 + MapConfig.cell_height / 2

        return cc.v2(px, py)
    }

    // 初始化空地图
    initMap()
    {
        this.m_model.reserMapList()
        let size = this.bg.getContentSize()
        for(let i:number = 0; i < MapConfig.max_row; i++)
        {
            for(let j:number = 0; j < MapConfig.max_col; j++)
            {

                let temp1 = getIndexByIJ(i, j)
                let temp2 = getIJByIndex(temp1)

                // cc.log("i, j", i, j, "temp1",temp1, "temp2", temp2.x, temp2.y)

                let node:cc.Node =  cc.instantiate(this.map_node)
                node.parent = this.map_cell.node
                let pos = this.getPos(cc.v2(i, j))
                node.x = pos.x
                node.y = pos.y

                let index:number = getIndexByIJ(i, j)
                node.getComponent("MapNode").setLabel(index)
                this.m_model.updateMapWithIJ(cc.v2(i, j), new MapNodeData.MapData(index, MapNodeData.mapdataEnum.none))
            }
        }
    }

    loadMap(level:number)
    {
        cc.log("level", level)
        let size = this.bg.getContentSize()
        for(let i:number = 0; i < MapConfig.max_row; i++)
        {
            this.map_list_node[i] = []
            for(let j:number = 0; j < MapConfig.max_col; j++)
            {
                let temp = this.m_model.map_list[i][j]
                if (temp.dataType == MapNodeData.mapdataEnum.none)
                {
                    let _type = this.getOneType()
                    // 生成一个方块 
                    let node = this.getOneRect(getIndexByIJ(i, j), _type)


                } 
            }
        }
    }

    select_node(pos:cc.Vec2)
    {
        cc.log("选中pos", pos.x, pos.y)
        this.reset_all_select()
        let arr = this.m_model.checkNear(pos)
        
        arr.forEach(_pos=>{
            let p = getIJByIndex(_pos)
            let node = this.map_list_node[p.x][p.y]
            if (node)
            {
                node.getComponent("RectNode").m_select = true
            }
        });
    }

    reset_all_select()
    {
        for(let i:number = 0; i < MapConfig.max_row; i++)
        {
            for(let j:number = 0; j < MapConfig.max_col; j++)
            {
                let node =  this.map_list_node[i][j]
                if(node)
                {
                    node.getComponent("RectNode").m_select = false
                }
            }
       }
    }   

    // 获取一个方块
    getOneRect(index:number, _type:MapNodeData.mapdataEnum):cc.Node
    {
        let pIndex = getIJByIndex(index)
        let node = cc.instantiate(this.rect_node)
        let receNode = node.getComponent("RectNode")
        this.map_list_node[pIndex.x][pIndex.y] = node
        receNode.m_select = false
        receNode.img_type = _type
        receNode.index = getIndexByIJ(pIndex.x, pIndex.y)
        node.parent = this.map_cell.node
        let pos = this.getPos(cc.v2(pIndex.x, pIndex.y))
        node.x = pos.x
        node.y = pos.y

        this.m_model.setmaptype(pIndex, _type)

        node.on(cc.Node.EventType.TOUCH_END, function(event) {
            // 查看当前节点是否选中
            let receNode = node.getComponent("RectNode")
            if (receNode.m_select)
            {
                // 消除当前
                let arr = this.m_model.checkNear(getIJByIndex(receNode.index))
                this.cancellation(arr)
            }
            else
            {
                // 开始查找周边相同的
                this.select_node(getIJByIndex(receNode.index))
            }
        }, this)

        return node
    }

    getOneType():number
    {
        let _type = Math.floor(Math.random()*100 % this.max_type) 

        return _type
    }

    // 清除节点
    cancellation(arr:Array<number>)
    {

        // 消耗一次步数

        // 计算分数
        cc.log("arr", arr)

        // 需要指定清除规则
        arr.forEach(_pos => {
            let p = getIJByIndex(_pos)
            let node = this.map_list_node[p.x][p.y]
            // cc.log("node", node)
            if(node)
            {
                node.getComponent("RectNode").m_select = false // 取消选中，然后触发消除
                cc.log("隐藏====>>>>>>>", p.x, p.y)
                node.removeFromParent()
                this.map_list_node[p.x][p.y] = null
                this.m_model.setmaptype(p, MapNodeData.mapdataEnum.none)
            }

        });

        // 触发生成规则  实现从上到下掉落
        for(let i = 0; i < MapConfig.max_row; i++)
        {
            let count = 0
            let maxIndex = 0
            for(let j = 0; j < MapConfig.max_col; j++)
            {
                let node  = this.map_list_node[i][j]
                if(!node)
                {
                    count = count + 1
                }
                else
                {
                    if (i == 0)
                    {
                        cc.log("count. j", count, j)
                    }
                    if(count > 0)
                    {
                        let sub = count
                        let pos = this.getPos(cc.v2(i, j-sub))
                        let px = pos.x
                        let py = pos.y
    
                        cc.tween(node).to(0.2, {
                            x:px,
                            y:py
                        }).call(()=>{
                            this.map_list_node[i][j-sub] = node
                            this.map_list_node[i][j] = null
                            this.m_model.setmaptype(cc.v2(i, j-sub), this.m_model.map_list[i][j].dataType)
                            this.m_model.setmaptype(cc.v2(i, j), MapNodeData.mapdataEnum.none)

                            let receNode = node.getComponent("RectNode")
                            receNode.index = getIndexByIJ(i, j-sub)
                        }).tag(123)
                        .start()

                        // node.runAction(cc.sequence(
                        //     cc.moveTo(0.2, cc.v2(x, y)),
                        //     cc.callFunc(()=>{
                        //         this.map_list_node[i][j-count] = node
                        //         this.map_list_node[i][j] = null
                        //         this.m_model.setmaptype(cc.v2(i, j-count), this.m_model.map_list[i][j].dataType)
                        //         this.m_model.setmaptype(cc.v2(i, j), MapNodeData.mapdataEnum.none)
                        //     })
                        // ))
                    }
                } 
            }

            // 生成新的节点
            for(let j = MapConfig.max_col-count; j < MapConfig.max_col; j++)
            {
                let _type = this.getOneType()
                // 生成一个方块 
                let node = this.getOneRect(getIndexByIJ(i, j), _type)


            }


        }
    }



}
