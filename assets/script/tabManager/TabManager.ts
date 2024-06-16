import { _decorator, Component, Node } from "cc";
import { Tab } from "./Tab";
const { ccclass, property } = _decorator;

@ccclass("TabManager")
export class TabManager extends Component {
  @property({ type: [Node] })
  tabs: Node[] = [];

  tabActive: number;

  start() {
    this.tabActive = 0
  }
  refresh() {
    this.tabs.map((tab, index: number) => {
      if (index == this.tabActive) {
        tab.getComponent(Tab).setActive(true);
      } else {
        tab.getComponent(Tab).setActive(false);
      }
    });
  }
  public toggle(val: number) {
    if (val == this.tabActive) return;
    this.tabActive = val;
    this.refresh();
  }
}
