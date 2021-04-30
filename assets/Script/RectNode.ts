// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;
    // @property
    // text: string = 'hello';
    @property(cc.Sprite)
    select:cc.Sprite = null

    @property(cc.Sprite)
    img_bg:cc.Sprite = null

    // @property({type:cc.Integer, step:1, max:10, min:1})
    // img_type:number = 1

    m_is_select = false;
    m_img_type = 0
    m_index = 0

    set index(__index)
    {
        if (this.m_index == __index) 
        { 
            return
        }
        this.m_index = __index
    }
    get index()
    {
       return this.m_index 
    }


    set m_select(_select)
    {
        if (this.m_is_select == _select) 
        { 
            return
        }
        this.m_is_select = _select
        this.select.enabled = this.m_is_select

        var anim = this.select.getComponent(cc.Animation);
        anim.play()

    }
    get m_select()
    {
       return this.m_is_select 
    }

    set img_type(_type)
    {
        this.m_img_type = _type
        
        let path = "star/fight_"+_type
        cc.resources.load(path, cc.SpriteFrame, function(error, spriteFrame){
            if(!error)
            {
                this.img_bg.spriteFrame = spriteFrame
            }
        }.bind(this))
    }
    
    get img_type()
    {
        return this.m_img_type
    }


    // onLoad () {}

    start () {
        this.select.enabled = false
        this.node.active = true
    }

    // update (dt) {}
}
