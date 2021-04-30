// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // @property(cc.Label)
    // sp: cc.Label = null;

    setLabel(str:string|number)
    {
        this.label.string = String(str)
        // this.getComponent("cc.Sprite").color = Number(str) % 2 == 0 ? cc.color(0, 0, 0, 255):cc.color(254, 254, 4, 255)
        let sp:cc.Sprite = this.getComponent("cc.Sprite")
        // let node:cc.Node = this.getComponent("cc.Node")
        
        let opacity = Number(str) % 2 == 0 ? 60:120
        
        // cc.log("node.opacity", node, node.opacity)
        this.node.opacity = opacity
        // sp.opctity = false
        //sp.se = Number(str) % 2 == 0 ? 0:255
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
