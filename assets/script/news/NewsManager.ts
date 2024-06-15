import { _decorator, Component, Node } from "cc";
import { CatchedAptNews } from "./CatchedAptNews";
import { CatchedEgonNews } from "./CatchedEgonNews";
import { NewsType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("NewsManager")
export class NewsManager extends Component {
  @property({ type: [Node] })
  newsNodes: Node[] = [];

  newsProcesses: any[] = [null, null, CatchedAptNews, CatchedEgonNews];
  currentNews: NewsType;

  start() {
    this.currentNews = NewsType.HighScore;
    this.newsNodes.forEach((n: Node, index) => {
      n.active = false;
      if (this.currentNews == index) {
        n.active = true;
      }
    });
  }
  public showNews(type: NewsType, data?: any) {
    if (this.newsNodes[this.currentNews]) {
      this.newsNodes[this.currentNews].active = false;
    }
    this.currentNews = type;
    this.newsNodes[this.currentNews].active = true;
    let process = this.newsNodes[this.currentNews].getComponent(
      this.newsProcesses[this.currentNews]
    ) as any;
    if (process && process.init) {
      process.init(data);
    }
  }
}
