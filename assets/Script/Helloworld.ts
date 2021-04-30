const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';
    @property(cc.Prefab)
    map_node:cc.Prefab = null;

    start () {
        // init logic
        // this.label.string = this.text;
    }
}
