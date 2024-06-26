import { _decorator, Component, Label, Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Toast")
export class Toast extends Component {
  @property({ type: Label })
  labelContent: Label;

  init({
    content,
    playOnLoad = true,
  }: {
    content: string;
    playOnLoad?: boolean;
  }) {
    this.node.getComponent(Animation).playOnLoad = playOnLoad;
    this.labelContent.string = `${content}`;
  }

  onFinishAnim() {
    this.node.destroy();
  }
}
